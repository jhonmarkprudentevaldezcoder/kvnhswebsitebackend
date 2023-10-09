const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    ID: {
      type: String,
    },

    RFID: {
      type: String,
    },

    Username: {
      type: String,
    },

    Password: {
      type: String,
    },
    Email: {
      type: String,
    },
    Surname: {
      type: String,
    },
    FirstName: {
      type: String,
    },
    MiddleName: {
      type: String,
    },
    Address: {
      type: String,
    },
    Gender: {
      type: String,
    },
    GradeLevel: {
      type: String,
    },
    Strand: {
      type: String,
    },
    Section: {
      type: String,
    },
    ContactNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Students", studentSchema);

module.exports = Student;
