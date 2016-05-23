#!/usr/bin/env node
'use strict';
const program = require('commander');
const chalk = require('chalk');
const moment = require('moment');
const table = require('easy-table')

//Setup NeDB
const Datastore = require('nedb');
const db = new Datastore({ filename: 'data/todoList.db', autoload: true });

function todo(todoTxt, priority) {
  this.todoTxt = todoTxt;
  this.priority = priority.toLowerCase();
  this.dateAdded = moment().format();
  this.complete = false;
}

program
  .version('0.0.1')
  .option('-a, --add <string>','Add a new todo item. priority will defualt to "Medium" unless you specify with -p option.')
  .option('-c, --complete <id>', 'Mark todo with <id> complete.')
  .option('-s, --showComplete [timeperiod]', 'Show all completed Items. Optionally specify a time periord. Defualts to "week". Choices are "week", "Month", "Year", "AllTime"', /^(week|month|year|allTime)$/i, 'week')
  .option('-l, --list', 'List all open todo items')
  .option('-p, --priority <string>', 'set priority of todo. Only used with "-a" option.')
  .parse(process.argv);


let showCompleted = true;

if (program.add) {
  showCompleted = false;
  //console.log(chalk.red(`the -a (add) option was inputed with the value:  "${program.add}"`));
  let todoTxt = program.add;
  let priority = program.priority || "med";
  let addTodo = new todo(todoTxt, priority);
  //Insert this new todo into database
  db.insert(addTodo, function (err, newTodo) {
    console.log(chalk.yellow(`New todo Added!`));
    listTodos();
  });
}

if (program.complete) {
  db.find({ complete: false }, function (err, toDos) {
    let markComplete = toDos[program.complete]._id;
    console.log(`ToDo with Id: ${program.complete} marked complete.`);
    completeTodo(markComplete);
    listTodos();
  })

}

if (program.list) {
  //console.log(JSON.stringify(program));
  listTodos();
  showCompleted = false;
}

if (program.showComplete) {
  if (showCompleted){
    listCompleteTodos(program.showComplete);
  } else {
    showCompleted = true;
  }
}

function listTodos(){
  db.find({ complete: false }, function (err, toDos) {
    console.log(`${toDos.length} Current todos:`);

    let t = new table;
    toDos.forEach(function(todo, index){
      if(todo.priority == 'high'){

        t.cell(`ID`, index);
        t.cell(`Priority`, chalk.white.bgRed(' HIGH '));
        t.cell(`ToDo`, chalk.bold.white(todo.todoTxt));
        t.cell(`Date`, moment(todo.dateAdded).format('MM/DD/YYYY h:mm:ss a'));
        t.cell(`Age`, moment(todo.dateAdded).fromNow());
        t.newRow();
        //console.log(chalk.blue(`${index} - `) + chalk.white.bgRed(' HIGH ') + chalk.bold.white(` - ${todo.todoTxt}`) + chalk.green(` Date: ${moment(todo.dateAdded).format('MM/DD/YYYY h:mm:ss a')}`));
      }
    })

    toDos.forEach(function(todo, index){
      if(todo.priority == 'med'){
        t.cell(`ID`, index);
        t.cell(`Priority`, chalk.white.bgBlue(' MED '));
        t.cell(`ToDo`, chalk.bold.white(todo.todoTxt));
        t.cell(`Date`, moment(todo.dateAdded).format('MM/DD/YYYY h:mm:ss a'));
        t.cell(`Age`, moment(todo.dateAdded).fromNow());
        t.newRow();
        //console.log(chalk.blue(`${index} - `) + chalk.bold.white(`${todo.todoTxt}`) + chalk.green(` Date: ${moment(todo.dateAdded).format('MM/DD/YYYY h:mm:ss a')}`));
      }
    })

    toDos.forEach(function(todo, index){
      if(todo.priority == 'low'){
        t.cell(`ID`, index);
        t.cell(`Priority`, chalk.bgGreen(' LOW '));
        t.cell(`ToDo`, chalk.bold.white(todo.todoTxt));
        t.cell(`Date`, moment(todo.dateAdded).format('MM/DD/YYYY h:mm:ss a'));
        t.cell(`Age`, moment(todo.dateAdded).fromNow());
        t.newRow();
        //console.log(chalk.blue(`${index} - `) + chalk.bgYellow(' LOW ') + chalk.bold.white(` - ${todo.todoTxt}`) + chalk.green(` Date: ${moment(todo.dateAdded).format('MM/DD/YYYY h:mm:ss a')}`));
      }
    })
    console.log(t.toString());
  });

}

function completeTodo(id){
  db.update({ _id: id }, { $set: { complete: true, dateCompleted: moment().format() } }, function (err, numReplaced) {
    console.log(`Number Replaced: ${numReplaced}`);
  });
}

function listCompleteTodos(period){
  db.find({ complete: true }, function (err, toDos) {
    console.log(`${toDos.length} Completed todos for period: ${period}`);
    let tb = new table;
    toDos.forEach(function(todo, index){
      tb.cell(`ID`, index);
      tb.cell(`Priority`, chalk.grey(todo.priority));
      tb.cell(`ToDo`, chalk.grey(todo.todoTxt));
      tb.cell(`Added Date`, moment(todo.dateAdded).format('MM/DD/YYYY h:mm:ss a'));
      tb.cell(`Completed`, moment(todo.dateCompleted).format('MM/DD/YYYY h:mm:ss a'));
      tb.newRow();
    })
    console.log(tb.toString());
  })
}

// if program was called with no arguments, show help.
//console.log(`Program rawArgs is: ${JSON.stringify(program.rawArgs)}`)
//console.log(`Program rawArgs length: ${program.rawArgs.length}`)
if (program.rawArgs.length < 3) {
  program.help();
}
