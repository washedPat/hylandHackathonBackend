const sqlite3 = require('sqlite3').verbose();
const uuid = require("uuid/v4");
// Open the database
const db = new sqlite3.Database('C:/Users/pbrop/Desktop/backend/src/db/database.db', (err) => {
    if(err){
        console.error(err);
    }
});

exports.getUserData = async (id) => {
    return new Promise( (resolve, reject) => {
        const get = `SELECT UserID,Username,Password,Name,Email,SchoolID FROM USERS WHERE UserID = '${id}'`;
        db.get(get,[],(err,rows)=>{
            if(err){
                reject(err);
            }
            //console.log(rows);
            resolve(rows);
        });
    });
}

exports.getUserSchool = (userSchoolID) => {
    return new Promise( (resolve, reject) => {
        const get = `SELECT SchoolID, Name, Address FROM SCHOOLS WHERE SchoolID = ${userSchoolID}`;
        db.get(get, [], (err, row) => {
            if (err) reject(err);
            
            resolve(row);
        });
    });
}

exports.getUserSchedule = (id) => {
    return new Promise( (resolve, reject) => {
        const get = `SELECT ClassID, UserID FROM USERSCHEDULE WHERE UserID = '${id}'`;
        db.all(get, (err, rows) => {
            if (err) reject(err);
            console.log("SCHEDULE ROWS:");
            console.log(rows);
            resolve(rows);
        });
    })
}

exports.getClassData = (classID) => {
    return new Promise( (resolve, reject) => {
        const get = `SELECT ClassID, ClassName, Period, Teacher FROM CLASSROOM WHERE ClassID = '${classID}'`;
        db.get(get, [], (err, row) => {
            if (err) reject(err);
            
            resolve(row);
        });
    });
}

exports.createUser = (un, pw, name, em, schoolID, schoolName, schoolAddress)=>{
    const id = uuid();
    console.log(id); // DELETE LATER
    const email = encodeURI(em);
    const add = `INSERT INTO USERS (UserID, UserName, Password, Name, Email, SchoolID) VALUES ('${id}', '${un}', '${pw}', '${name}', '${email}', '${schoolID}')`;
    db.run(add, [], (err) => {
        if(err){
            return console.log(err.message)
        }

        console.log("New User Created!");
    });

   
    const schoolAdd = `INSERT INTO SCHOOLS (SchoolID, Name, Address) VALUES ('${schoolID}', '${schoolName}', '${schoolAddress}')`;
    db.run(schoolAdd, [], err => {
        if (err) return console.error(err);

        console.log("School added to database")
    });
}

exports.createClass = (schoolID, className, period, teacher) => {
    const id = uuid();
    const add = `INSERT INTO CLASSROOM (ClassID, SchoolID, ClassName, Period, Teacher) VALUES ('${id}', '${schoolID}', '${className}', '${period}', '${teacher}')`;
    db.run(add, [], err => {
        if (err) console.error(err);
        console.log(id); // REMOVE LATER

        console.log("Classroom added to database")
    });
}

exports.login = (un,pw) => {
    return new Promise( (resolve, reject) => {
        const auth = `SELECT Username, Password FROM USERS WHERE Username = '${un}' AND Password = '${pw}'`
        db.get(auth, [], (err,row)=>{
            if (err){
                console.error(err);
                reject()
            }
            if(row){
                resolve(row)
            }else{
                reject()
            }
        })
    });
}

exports.getAssignments = (classID) => {
    return new Promise((resolve, reject) => {
        const assignments = `SELECT AssignmentID, ClassID, UserCreatedID, DateCreated, DueDate, Title, Description FROM ASSIGNMENTS WHERE ClassID = '${classID}'`;
        db.all(assignments,(err, row) => {
            if(err){
                console.error(err);
                reject();
            }
            if(row){
                resolve(row)
            }else{
                reject()
            }
        })
    })
}


exports.createAssignment = (classID, userID, title, description) => {
    return new Promise((resolve, reject) => {
        const assignmentId = uuid();
        const currentDate = Date.now()
        console.log(currentDate)
        const add = `INSERT INTO ASSIGNMENTS (AssignmentID, ClassID, UserCreatedID, DateCreated, DueDate, Title, Description) VALUES ('${assignmentId}', '${classID}', '${userID}', '${currentDate}', '${currentDate}', '${title}', '${description}')`
        db.run(add, [], (err)=>{
            if(err){
                reject()
                return console.error(err.message)
            }else{
                console.log("Successfully Created Assignmnt")
                resolve(add)
            }
        })
    })
}

exports.removeAssignment = (classID, assignmentId) => {
    return new Promise((resolve, reject) => {
        const remove = `DELETE FROM ASSIGNMENTS WHERE ClassID = '${classID}' AND AssignmentID = '${assignmentId}'`
        db.run(remove,[],(err)=> {
            if (err){
                reject()
                return console.error(err.message)
            }else{
                resolve()
                console.log("Successfully Removed Assignment")
            }
        })
    })
}

exports.addScheduledClass = (classID, userID) => {
    const add = `INSERT INTO USERSCHEDULE (UserID, ClassID) VALUES ('${userID}', '${classID}')`;
    db.run(add, [], err => {
        if (err) return console.error(err);

        console.log("Class scheduled for user " + userID);
    });
}


exports.addNote = (userID, content, title) => {
    const noteID = uuid();
    const add = `INSERT INTO NOTES (NoteID, UserID, ClassID, Contents, Title) VALUES ('${noteID}', '${userID}', '${null}', '${content}', '${title}')`;
    db.run(add, [], err => {
        if (err) return console.error(err);

        console.log("Note of id " + noteID + " added to database");
    })
}

exports.getUserNotes = (userID) => {
    return new Promise((resolve, reject) => {
        const get = `SELECT NoteID, Contents, Title FROM NOTES WHERE UserID = '${userID}'`;
        db.all(get, (err, rows) => {
            if (err) reject(err);

            resolve(rows);
        });
    });
}

exports.createLink = (userID,classID,name,url) =>{
    return new Promise((resolve, reject) => {
        const create = `INSERT INTO URLS (UserID, ClassID, Name, Url) VALUES ('${userID}', '${classID}', '${name}', '${url}')`
        db.run(create, [], (err) => {
            if (err){
                reject()
                console.log(err.message);
            }else{
                console.log("Successfully Added URL")
                resolve()
            }
        })
    })
}

exports.getLink = (classID) => {
    return new Promise((resolve, reject) => {
        const get = `SELECT Name, Url FROM URLS WHERE ClassID = '${classID}'`
        db.all(get, (err, rows)=>{
            if (err){
                reject()
            }else{
                resolve(rows)
            }
        });
    });
}

exports.getMessages = (classID, userID) => {
    return new Promise((resolve, reject) => {
        const get = `SELECT MessageID, ClassID, UserID, Message, DateCreated FROM MESSAGES WHERE ClassID = '${classID}'`
        db.all(get, (err,rows) => {
            if (err){
                console.log(err.message);
                reject()
            }else{
                console.log("Successfully Retrived Messages")
                resolve(rows)
            }
        })
    })  
}

exports.createMessage = (classID, userID, content) => {
    return new Promise((resolve, reject) => {
        const messageID = uuid()
        const dateCreated = Date.now()
        const create = `INSERT INTO MESSAGES (MessageID, ClassID, UserID, Message, DateCreated) VALUES ('${messageID}', '${classID}', '${userID}', '${content}', '${dateCreated}')`
    
        db.run(create, [], (err) => {
            if(err){
                console.log(err.message);
                reject()
            }else{
                console.log("Successfully Created Message")
                resolve()
            }
        })
    })
}
exports.createIssue = (classID, userID, title, description) => {
    const issueID = uuid();
    const date = Date.now();
    const add = `INSERT INTO ISSUES (IssueID, ClassID, UserCreatedId, Title, Description, DateCreated) VALUES ('${issueID}', '${classID}', '${userID}', '${title}', '${description}', '${date}')`;
    
    db.run(add, [], err => {
        if (err)
            console.error(err);
        else
            console.log("Issue with id of " + issueID + " in database");
    });
}

exports.getIssuePost = (issueID) => {
    return new Promise((resolve, reject) => {
        const get = `SELECT ClassID, UserCreatedID, Title, Description, DateCreated FROM ISSUES WHERE IssueID = '${issueID}'`;
        db.get(get, [], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
}

exports.getIssueComments = (issueID) => {
    return new Promise((resolve, reject) => {
        const get = `SELECT IssueCommentID, IssueID, ReplyParentID, UserCreatedID, DateCreated, Message FROM ISSUECOMMENTS WHERE IssueID = '${issueID}'`;
        db.all(get, (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}