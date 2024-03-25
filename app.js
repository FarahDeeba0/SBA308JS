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

function getLearnerData(course, assignmentGroup, submissions) {

    const learnerData = {};
    const result = [];
    try {

        const isValidGroup = assignmentGroup.course_id === course.id;

        if (!isValidGroup) {
        console.error("Invalid input: The AssignmentGroup does not belong to the course.");
        }
    
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

            //was the assignment submitted?? is it due yet?... and the 10% penalty
            if (assignment && new Date(assignment.due_at) < new Date()) {

                const pointsPossible = assignment.points_possible || 0;
        
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
                    console.error("Error: points_possible is zero for assignment", assignment_id);
                }
            
            }
    
        }
       result.push(...Object.values(learnerData).map(data => {
            const avg = data.totalScore / data.totalPossible;
            const formattedData = {
                id: data.id,
                avg: parseFloat(avg.toFixed(3)),
            };

            for (const assignmentId in data.individualScores) {
                formattedData[assignmentId] = parseFloat(data.individualScores[assignmentId].toFixed(3));
            }
      
            return formattedData;
       }));
        
        
        return result;
    } catch (error) {
        console.error("An error occurred!");
        return []; //return empty array if there is an error

    }
}
    const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);
    
