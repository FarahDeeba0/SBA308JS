// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];

  //--------------------------------------------------------------------------------------------------------------------------------------
//   function getLearnerData(course, ag, submissions) {
//     // here, we would process this data to achieve the desired result.
//     const result = [
//       {
//         id: 125,
//         avg: 0.985, // (47 + 150) / (50 + 150)
//         1: 0.94, // 47 / 50
//         2: 1.0 // 150 / 150
//       },
//       {
//         id: 132,
//         avg: 0.82, // (39 + 125) / (50 + 150)
//         1: 0.78, // 39 / 50
//         2: 0.833 // late: (140 - 15) / 150
//       }
//     ];
  
//     return result;
//   }
  
//   const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  
//   console.log(result);



// ----------------------MY CODE--------------------------------------------------------------------------------------
//PLAN: WORK STEP BY STEP___ explain the code to avoid confusion later on(for myself)-- *remove comments in the final commit
// STEP1: DECLARE FUNCTION
//Step 2: If an AssignmentGroup does not belong to its course (mismatching course_id), your program should throw an error, letting the user know that the input was invalid. Similar data validation should occur elsewhere within the program.


function getLearnerData(course, assignmentGroup, submissions) {
    try {
    const isValidGroup = assignmentGroup.course_id === course.id;
    if (!isValidGroup) {
        
        throw new Error("Invalid input: The AssignmentGroup does not belong to the course.");
    }

    // We have to initialize an empty object to store the data related to each learner's assignment submission
    
    const learnerData = {};

    //for..of loop to iterate over each submission
    for (const submission of submissions) {
        const { learner_id, assignment_id, submission: { score, submitted_at } } = submission;
        
        // Check if the learner's data exists in our learnerData object,
        // If not, initialize their data with default values.
        if (!learnerData[learner_id]) {
            learnerData[learner_id] = {
                id: learner_id, // Set the learner's ID
                totalScore: 0, // Initialize total score to 0
                totalPossible: 0, // Initialize total possible score to 0
                individualScores: {} // Initialize individual scores object
            };
        }

        //QUESTION: why do we set the initial values to 0?  - because it ensures that they are numeric values and avoids issues such as `NaN` errors when performing arithmetic operations

        //getting assignments from the assignment group

        const assignment = assignmentGroup.assignments.find(a => a.id === assignment_id);


        //was the assignment submitted?? is it due yet?? don't forget the 10% penalty
    
        if (assignment && new Date(assignment.due_at) < new Date()) {

                const pointsPossible = assignment.points_possible || 1;
        
                let actualScore = score;
                if (new Date(submitted_at) > new Date(assignment.due_at)) {
                    const penalty = score * 0.1; // 10% penalty
                    actualScore -= penalty;
                }

                //What if the points_possible is zero?
                if (pointsPossible !== 0) {

                    const individualScore = actualScore / pointsPossible;

                    learnerData[learner_id].totalScore += actualScore;
                    learnerData[learner_id].totalPossible += pointsPossible;
                    learnerData[learner_id].individualScores[assignment_id] = individualScore;
                
                } else {
                    console.error("Error: points_possible is zero for assignment", assignment_id); //doesn't work yet
                }
            
        }
    
    }
        const result = Object.values(learnerData).map(data => {
            const avg = data.totalScore / data.totalPossible;
            const formattedData = {
                id: data.id,
                avg: parseFloat(avg.toFixed(3)), //freecodecamp: use parseFloat() to convert string to floating point number.... here we use it to convert the avg to number
            };

            for (const assignmentId in data.individualScores) {
                formattedData[assignmentId] = parseFloat(data.individualScores[assignmentId].toFixed(3)); //converts the assignment strings to numbers--if you add parseFloat 
            }
      
            return formattedData;
        });
        return result;

    } catch (error) {
        // Log or handle any other potential errors
        console.error("An error occurred while processing the submission:", error.message);
    }
    }

    const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);
    



//what to check for at the end:
//does the code work with different numbers? //suprsingly yes :) // and works with different due dates
// any edgecases? ---- does it throw errors properly? yes-----
// is it in 0.01 decimal form? yes except submission '2' with student id: 125
//does the penalty get subtracted properly? //yes 10% gets subtracted
// does the output match exactly what was asked for? - The numbers are rounded to the nearest decimal in my code

//REQUIREMENTS NOT MET
//You should also account for potential errors in the data that your program receives. 
//What if points_possible is 0 ? 
//You cannot divide by zero.What if a value that you are expecting to be a number is instead a string ?

