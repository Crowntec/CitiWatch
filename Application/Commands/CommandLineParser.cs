namespace CitiWatch.Application.Commands
{
    public class CommandLineParser
    {
        private readonly string[] _args;

        public CommandLineParser(string[] args)
        {
            _args = args;
        }

        public bool IsCliCommand()
        {
            return _args.Length > 0 && 
                   (_args.Contains("create-admin") || 
                    _args.Contains("list-admins") || 
                    _args.Contains("--help"));
        }

        public string? GetCommand()
        {
            if (_args.Length == 0) return null;

            var command = _args[0].ToLower();
            return command switch
            {
                "create-admin" => "create-admin",
                "list-admins" => "list-admins",
                "--help" or "-h" or "help" => "help",
                _ => null
            };
        }

        public string? GetArgumentValue(string argumentName)
        {
            var prefix = $"--{argumentName}=";
            var arg = _args.FirstOrDefault(a => a.StartsWith(prefix, StringComparison.OrdinalIgnoreCase));
            
            if (arg == null) return null;
            
            var value = arg.Substring(prefix.Length);
            
            // Remove quotes if present
            if ((value.StartsWith("\"") && value.EndsWith("\"")) ||
                (value.StartsWith("'") && value.EndsWith("'")))
            {
                value = value.Substring(1, value.Length - 2);
            }
            
            return string.IsNullOrWhiteSpace(value) ? null : value;
        }

        public bool HasArgument(string argumentName)
        {
            return _args.Any(a => a.StartsWith($"--{argumentName}=", StringComparison.OrdinalIgnoreCase));
        }

        public void ValidateCreateAdminArguments()
        {
            var errors = new List<string>();

            if (!HasArgument("email"))
                errors.Add("Missing required argument: --email");

            if (!HasArgument("password"))
                errors.Add("Missing required argument: --password");

            if (errors.Any())
            {
                Console.WriteLine("❌ Error: Missing required arguments");
                foreach (var error in errors)
                {
                    Console.WriteLine($"   {error}");
                }
                Console.WriteLine();
                AdminCommands.ShowHelp();
                throw new ArgumentException("Invalid command line arguments");
            }
        }
    }
}