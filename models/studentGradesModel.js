const mongoose = require("mongoose");

const studentGradeSchema = mongoose.Schema(
  {
    ID: {
      type: String,
    },
    Strand: {
      type: String,
    },
    Subject: {
      type: String,
    },
    NumberOfAssessments: {
      type: String,
    },
    Quiz: {
      type: String,
    },
    Activity: {
      type: String,
    },
    Assignment: {
      type: String,
    },
    LongTest: {
      type: String,
    },
    Project: {
      type: String,
    },
    Exams: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Student_Grade = mongoose.model("Student_Grades", studentGradeSchema);

module.exports = Student_Grade;
