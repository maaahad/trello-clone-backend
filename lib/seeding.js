// ----------------------------------------------------------- //
// this module is responsible to seed some initial data to be tested
// ----------------------------------------------------------- //
// importing
const ChecklistItem = require("./database/models/checklist-item");
const Checklist = require("./database/models/checklist");
const User = require("./database/models/user");
const Card = require("./database/models/card");
const Comment = require("./database/models/comment");
const Cardlist = require("./database/models/cardlist");
const Board = require("./database/models/board");
const Workspace = require("./database/models/workspace");

async function seed() {
  //   user
  console.log("----------------- User -----------------");
  const ahad = new User({
    email: "ahad@yahoo.com",
    name: "muhammed ahad",
    password: "test",
    signedin: true,
  });

  const israt = new User({
    email: "israt@yahoo.com",
    name: "israt jahan",
    password: "test",
    signedin: false,
  });

  console.log(ahad, israt);
  await ahad.save();
  await israt.save();

  // checklist-item
  console.log("----------------- ChecklistItem-----------------");
  const checklistItem1 = new ChecklistItem({
    owner: ahad._id,
    title: "My checklist 1",
    due: new Date("2021-12-12"),
  });
  const checklistItem2 = new ChecklistItem({
    owner: israt._id,
    title: "My checklist 2",
    due: new Date("2022-01-31"),
    assignees: [israt._id, ahad._id],
  });
  console.log(checklistItem1, checklistItem2);
  await checklistItem1.save();
  await checklistItem2.save();
  //   checklist
  console.log("----------------- Checklist----------------");
  const checklist = new Checklist({
    owner: ahad._id,
    title: "My first checklist",
    items: [checklistItem1._id, checklistItem2._id],
  });
  console.log(checklist);
  await checklist.save();
  //   comment
  console.log("----------------- Comment----------------");
  const comment1 = new Comment({
    owner: ahad._id,
    body: "make sure my comment is published...",
  });
  const comment2 = new Comment({
    owner: israt._id,
    body: "I am also commenting...",
    edited: true,
  });
  console.log(comment1, comment2);
  await comment1.save();
  await comment2.save();
  //   card
  console.log("----------------- Card----------------");
  const card = new Card({
    owner: israt._id,
    title: "Trello-Clone-backend",
    description: "This is a sample card for testing purpose",
    comments: [comment2._id, comment1._id],
    checklists: [checklist._id],
    date: {
      start: new Date(),
      due: new Date("2021-12-31"),
    },
    labels: ["#fff", "#666"],
  });
  console.log(card);
  await card.save();
  //   cardlist
  console.log("----------------- Cardlist----------------");

  const cardlist1 = new Cardlist({
    owner: israt._id,
    title: "ToDo Cardlist",
    cards: [card._id],
  });
  const cardlist2 = new Cardlist({
    owner: ahad._id,
    title: "Old Cardlist",
  });
  console.log(cardlist1, cardlist2);
  await cardlist1.save();
  await cardlist2.save();

  //   Board
  console.log("----------------- board----------------");
  const board = new Board({
    owner: ahad._id,
    title: "Test Board",
    members: [ahad._id, israt._id],
    cardlists: [cardlist1._id, cardlist2._id],
  });
  console.log(board);
  await board.save();

  //   workspace
  console.log("----------------- workspace----------------");
  const workspace = new Workspace({
    owner: ahad._id,
    title: "Web Development workspace",
    members: [ahad._id, israt._id],
    boards: [board._id],
  });
  console.log(workspace);
  await workspace.save();
}

// || testing
async function addMembersToWorkspace() {
  const users = await User.find({});
  const usersId = users.map((user) => user._id);
  Workspace.updateMany(
    { title: "Web Development workspace" },
    { $push: { members: usersId } },
    (error) => {
      if (error) console.error(error.message);
    }
  );
}

module.exports = { seed, addMembersToWorkspace };
