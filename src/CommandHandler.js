var columnify = require('columnify');

var List = {
    "?":
    {
        alias: "help"
    },

    "help":
    {
        desc: "This list",
        run: (rest) =>
        {
            var cmds = {};

            for (var name in List)
            {
                var cmd = List[name];

                if (cmd.desc)
                {
                    cmds[name] = cmd.desc;
                }
            }

            Logger.print(columnify(cmds, {columnSplitter: ' - ', showHeaders: false}).blue.bold);
        }
    }
}

class CommandHandler
{
    /*
    Initializes a new instance of the parent class
    */
    constructor(parent, commands)
    {
        this.parent = parent
        for (var key in commands) {
            if (commands.hasOwnProperty(key)) {
                List[key] = commands[key];
            }
        }
    }

    /*
    Runs the command based on input given.
    */
    handleCommand(input)
    {
        var split = input.split(" ");
        var cmd = split[0];
        var rest = "";
        var param = input.substr(input.indexOf(' ') + 1);


        for (var i = 1; i < split.length; i++)
        {
            rest += split[i];
        }

        rest = rest.slice(0, -1);

        // Handle command
        if (List.hasOwnProperty(cmd))
        {
            var command = List[cmd];
            if (command.hasOwnProperty("alias"))
            {
                List[command["alias"]]["run"](rest);
            }
            else
            {
                List[cmd]["run"](param, this.parent);
            }
        }
        else
        {
            Logger.error("Invalid command! Type 'help' or '?' for a list of commands.");
        }

        // Prompt Again
        Logger.prompt(this.handleCommand.bind(this), Config.Logger.Prompt)
    }
}

module.exports = CommandHandler;
