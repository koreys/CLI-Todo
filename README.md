# CLI-Todo
A Simple command line todo list app.

##Install
```
npm install cli-todo -g
npm link
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
First list you todo items (`td -l`). The id will be in the first column.

####Show completed todo items
```
td -s
```
