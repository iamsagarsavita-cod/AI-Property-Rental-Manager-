const ai = require("../config/gemini");
const PropertyModel = require("../models/PropertyModel");
const RentalReqModel = require("../models/rentalRequestModel");
const { isValid, isValidObjectId } = require("../utils/validator");

const MODEL_NAME = "gemini-3.6-flash";

const parsedJSON = (text) => {
  let cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
};

// AI Property Description Generator (Owner)
const generateDescription = async (req, res) => {
  try {
    let data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "Bad Request ! No Data Provided" });
    }

    let { title, location, bedRooms, bathRooms, area, price, categoryName } =
      data;

    if (!isValid(title)) {
      return res.status(400).json({ msg: "Property Title is Required" });
    }

    if (!isValid(location)) {
      return res.status(400).json({ msg: "Location is Required" });
    }

    if (!isValid(bedRooms)) {
      return res.status(400).json({ msg: "Bedrooms is Required" });
    }

    if (!isValid(bathRooms)) {
      return res.status(400).json({ msg: "Bathrooms is Required" });
    }

    if (!isValid(area)) {
      return res.status(400).json({ msg: "Area is Required" });
    }

    if (!isValid(price)) {
      return res.status(400).json({ msg: "Price is Required" });
    }

    if (!isValid(categoryName)) {
      return res.status(400).json({ msg: "CategoryName is Required" });
    }

    let prompt = `You are a professional real estate copywriter.
Generate an appealing, well-written property description (60-100 words) for a rental listing using these details:

Title: ${title}
Category: ${categoryName || "Not Specified"}
Location: ${location}
Bedrooms: ${bedRooms}
Bathrooms: ${bathRooms}
Area: ${area} sq.ft
Price: ${price} per month

Return ONLY valid JSON in this exact format, nothing else, no markdown, no backticks:
{ "description": "generated description here" }`;

    let response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let responsedText = response.text;
    let parsed = parsedJSON(responsedText);

    return res.status(200).json({
      msg: "Property Description Generated Successfully",
      description: parsed.description,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// AI Property Summary Generation
const generateSummary = async (req, res) => {
  try {
    let propertyId = req.params.id;
    if (!isValidObjectId(propertyId)) {
      return res.status(400).json({ msg: "Invalid Property Id" });
    }
    let property = await PropertyModel.findById(propertyId);

    if (!property) {
      return res.status(404).json({ msg: "Property Not Found" });
    }

    let prompt = `Summarize the following property description into one short, catchy sentence (max 20 words), suitable for a listing card:

    "${property.description}"

      Return ONLY valid JSON in this exact format, nothing else, no markdown, no backticks:
      { "summary": "generated summary here" }`;

    let response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    let responsedText = response.text;
    let parsed = parsedJSON(responsedText);

    return res.status(200).json({
      msg: "Property Summary Generated Successfully",
      summary: parsed.summary,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// AI Property Requirement Analysis (User)
const analysisRequirement = async (req, res) => {
  try {
    let data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "Bad Request ! No Data Provided" });
    }

    let { requirement } = data;

    if (!isValid(requirement)) {
      return res.status(400).json({ msg: "Requirement Text is Required" });
    }

    let prompt = `You are a real estate assistant. A user has described what kind of rental property they are looking for. Extract structured search filters from their text.

    User Requirement: "${requirement}"

    Return ONLY valid JSON in this exact format, nothing else, no markdown, no backticks. Use null for any field not mentioned:
    {
    "location": "string or null",
    "minPrice": "number or null",
    "maxPrice": "number or null",
    "bedrooms": "number or null",
    "bathrooms": "number or null",
    "categoryHint": "string or null (e.g. Apartment, Villa, PG, Studio)"
    }`;

    let response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    let responsedText = response.text;
    let parsed = parsedJSON(responsedText);

    return res.status(200).json({
      msg: "Requirement Analysis Successfully",
      filters: parsed,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// AI Property Recommendation (User)
const recommendProperty = async (req, res) => {
  try {
    let userId = req.userId;

    let pastRequests = await RentalReqModel.find({ userId }).populate(
      "propertyId",
    );

    let availableProperty = await PropertyModel.find({
      status: "available",
    })
      .populate("categoryId")
      .limit(20);

    if (availableProperty.length === 0) {
      return res.status(404).json({ msg: "No Available Properties Found" });
    }

    let preferenceSummary =
      pastRequests.length > 0
        ? pastRequests
            .filter((r) => r.propertyId)
            .map(
              (r) => `${r.propertyId.location} - ${r.propertyId.price}/month`,
            )
            .join(", ")
        : "No Past Rental History Available";

    let propertyList = availableProperty.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      category: p.categoryId?.categoryName || "N/A",
      location: p.location,
      price: p.price,
      bedRooms: p.bedRooms,
      bathRooms: p.bathRooms,
    }));

    let prompt = `You are a real estate recommendation engine.

    User's past rental interest: ${preferenceSummary}

    Available Properties:
    ${JSON.stringify(propertyList)}

    Based on the user's past interest (location, price range), pick the top 5 best matching property ids from the list above. If there is no past interest, just pick 5 well-rounded diverse options.

    Return ONLY valid JSON in this exact format, nothing else, no markdown, no backticks:
    { "recommendedIds": ["id1", "id2", "id3"] }`;

    let response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    let responsedText = response.text;
    let parsed = parsedJSON(responsedText);

    let recommendedProperty = await PropertyModel.find({
      _id: {
        $in: parsed.recommendedIds,
      },
    }).populate("categoryId");

    return res.status(200).json({
      msg: "Properties Recommended Successfully",
      recommendedProperty,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  generateDescription,
  generateSummary,
  analysisRequirement,
  recommendProperty,
};
