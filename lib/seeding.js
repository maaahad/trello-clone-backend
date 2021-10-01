// ----------------------------------------------------------- //
// this module is responsible to seed some initial data to be tested
// ----------------------------------------------------------- //
// importing
const { ChecklistItem } = require("./database/models/checklist-item");
const { Checklist } = require("./database/models/checklist");
const { User } = require("./database/models/user");
const { Card } = require("./database/models/card");
const { Comment } = require("./database/models/comment");
const { Cardlist } = require("./database/models/cardlist");
const { Board } = require("./database/models/board");
const Workspace = require("./database/models/workspace");

function seed() {
  //   user
  console.log("----------------- User -----------------");
  const ahad = new User({
    email: "ahad@yahoo.com",
    firstname: "muhammed",
    lastname: "ahad",
    password: "test",
    signedin: true,
  });

  const israt = new User({
    email: "israt@yahoo.com",
    firstname: "israt",
    lastname: "jahan",
    password: "test",
    signedin: false,
  });

  console.log(ahad, israt);
  ahad.save();
  israt.save();
  // checklist-item
  console.log("----------------- ChecklistItem-----------------");
  const checklistItem1 = new ChecklistItem({
    owner: ahad,
    title: "My checklist 1",
    due: new Date(),
  });
  const checklistItem2 = new ChecklistItem({
    owner: israt,
    title: "My checklist 2",
    due: new Date(),
    assignees: [israt, ahad],
  });
  console.log(checklistItem1, checklistItem2);
  checklistItem1.save();
  checklistItem2.save();
  //   checklist
  console.log("----------------- Checklist----------------");
  const checklist = new Checklist({
    owner: ahad,
    title: "My first checklist",
    items: [checklistItem1, checklistItem2],
  });
  console.log(checklist);
  checklist.save();
  //   comment
  console.log("----------------- Checklist----------------");
  const comment1 = new Comment({
    owner: ahad,
    body: "make sure my comment is published...",
  });
  const comment2 = new Comment({
    owner: israt,
    body: "I am also commenting...",
    edited: true,
  });
  console.log(comment1, comment2);
  comment1.save();
  comment2.save();
  //   card
  console.log("----------------- Card----------------");
  const card = new Card({
    owner: israt,
    title: "Trello-Clone-backend",
    description: "This is a sample card for testing purpose",
    comments: [comment2, comment1],
    checklists: [checklist],
    date: {
      start: new Date(),
      due: new Date("2021-12-31"),
    },
    labels: ["#fff", "#666"],
  });
  console.log(card);
  card.save();
  //   cardlist
  console.log("----------------- Card----------------");

  const cardlist1 = new Cardlist({
    owner: israt,
    title: "ToDo Cardlist",
    cards: [card],
  });
  const cardlist2 = new Cardlist({
    owner: ahad,
    title: "Old Cardlist",
  });
  console.log(cardlist1, cardlist2);
  cardlist1.save();
  cardlist2.save();

  //   Board
  console.log("----------------- board----------------");
  const board = new Board({
    owner: ahad,
    title: "Test Board",
    members: [ahad, israt],
    cardlists: [cardlist1, cardlist2],
  });
  console.log(board);
  board.save();

  //   workspace
  console.log("----------------- workspace----------------");
  const workspace = new Workspace({
    owner: ahad,
    title: "Web Development workspace",
    members: [ahad, israt],
    boards: [board],
  });
  console.log(workspace);

  workspace.save((error, wp) => {
    if (error) {
      console.log(`[DATABASE_ERROR] : ${error.message}`);
    }
    console.log("Seeding was successfull");
  });
}

module.exports = seed;
