# CLI-Todo
A Simple command line todo list app. Written in javascript. Requires Node.js.

![CLI-Todo Screenshot](https://dl.dropboxusercontent.com/u/123958/img/Screen.png)

##Install
First install node.js. Go to nodejs.com for OS specific instructions.

> I suggest installing CLI-Todo inside a folder in your dropbox folder as I plan on creating a mobile web app that will need access to this database file.

```
cd Dropbox
mkdir CLI-Todo
cd CLI-Todo
npm install cli-todo -g
npm link
```
> `npm link` will make the "td" command available anywhere in your command line.
> You may need to add `sudo` in front of the two `npm` commands.

CLI-Todo uses the awesome NeDB javascript database. It's a flat file NoSQL database that uses a MongoDB API.
Check it out [here](https://github.com/louischatriot/nedb).

Upon creating your first todo item NeDB will create a database file for you called todoList.db.

Go ahead and create your first todo item:

```
td -a "Become Sith Lord"
```

You can see the help by using the -h flag:
```
td -h
```

##Usage
```
td <command> [option]
```

##Examples
####Add a todo item
```
td -a "Kill Superman with Kryptonite purchased last week."
```
All items added to your todo list will get a priority of "Medium" by default.

To set a "High" or "Low" priority add the `-p <high|med|low>` option.
```
td -a "Kill Superman with Kryptonite purchased last week." -p "high"
```

####List all current open todo items
```
td -l
```

####Mark todo item as complete
```
td -c <todo ID>
```
First list your todo items (`td -l`). The id will be in the first column.

####Show completed todo items
```
td -s
```
