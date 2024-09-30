const { MongoClient } = require("mongodb");
const uri = require("./atlas_uri");
let mongoose = require("mongoose");
require("dotenv").config();

const connectToDatabase = async () => {
  await mongoose
    .connect(process.env.MONGO_URI, {})
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
};

//creating personSchema
let personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: Number,
  email: String,
  favoriteFoods: [],
});

//Creating  a model
const Person = mongoose.model("Person", personSchema);

//To find individual person you write the async function here and parse it in the asyn function below
async function getPersonByName() {
  const personData = await Person.find({ name: "Dave Lee" });
  console.log(`Person data has been retrieved`, personData);
}

//Getting person by food
async function getPersonByFood() {
  const personFood = await Person.findOne({ favoriteFoods: "pizza" });
  console.log("Food retrieved", personFood);
}

//Find by ID
async function getPersonById() {
  const personID = await Person.findById({ _id: "66fadeef48390a8d9ee7d42d" });
  console.log("ID no is:", personID);
}

//Adding item to already existing items in database
async function updateHamburger(personId) {
  const person = await getPersonById(personId);

  if (person) {
    person.favoriteFoods.push("hamburger");
    person.markModified("favouriteFoods");
    await person.save();
    console.log("Updated person's favorite foods:", person.favoriteFoods);
  } else {
    console.log("Person not found");
  }
}

//Getting by name and updating age
async function getandUpdate() {
  const personName = await Person.findOneAndUpdate(
    { name: "Mike Oniel" },
    { age: 24 },
    { new: true }
  );
  console.log("Person is:", personName);
}

//Deleting one person by name
// async function removePersonById() {
//     const deletePerson = await Person.findOneAndDelete({
//       name: "Miles Kurosaki",
//     });
//   console.log("Deleted person:", deletePerson);
// }

//Delete many people with the same name
async function deleteMany() {
  const deletePersons = await Person.deleteMany({ name: "Ian Ngesa" });
  console.log("Deleted man persons:", deletePersons);
}

//Chaining Search Query
async function chainSearch() {
  const chaining = await Person.find({
    favoriteFoods: "fries",
  })
    .sort("name")
    .limit(2)
    .select({ age: 21 });
  console.log("Chained Methods:", chaining);
}

const main = async () => {
  try {
    await connectToDatabase();
    //Adding a single person happens here
    // const person1 = new Person({
    //   name: "Dave Meel",
    //   age: 21,
    //   email: "mike@gmail.com",
    //   favoriteFoods: ["chicken", "pizza", "fries", "lasagna"],
    // });

    //Adding Multiple persons to the model
    const arrayofPeople = [
      {
        name: "Ian Ngesa",
        age: 22,
        email: "ian@gmail.com",
        favoriteFoods: ["chicken", "pizza", "fries", "lasagna"],
      },
      {
        name: "Ashley Kinash",
        age: 25,
        email: "ashley@gmail.com",
        favoriteFoods: ["uji", "icecream", "rice", "meatballs"],
      },
      {
        name: "Miles Kurosaki",
        age: 18,
        email: "miles@gmail.com",
        favoriteFoods: ["ramen", "sushi", "red snapper", "fries"],
      },
    ];

    await getPersonByName();
    await getPersonByFood();
    await getPersonById();
    await getandUpdate();
    // await removePersonById();
    await deleteMany();
    await chainSearch();
    //How to parse when adding multiple documents
    // await Person.insertMany(arrayofPeople);
    // //Used when adding a single document in the model
    // // await person1.save();
    // // console.log("Person data saved to Database");
    // console.log("People data saved to Database");
  } catch (error) {
    console.error(`Error inserting document: ${error}`);
  } finally {
    await mongoose.connection.close();
  }
};
main();

// const client = new MongoClient(uri);
// const dbname = "restaurant";

// const connectToDatabase = async () => {
//   try {
//     await client.connect();
//     console.log(`Connected to the ${dbname} database`);
//   } catch (error) {
//     console.error(`Error connecting to the database: ${error}`);
//   }
// };
