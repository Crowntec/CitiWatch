using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CitiWatch.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAdminCredentials : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Update the admin user to have proper email and new password hash for "Admin123"
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000001"),
                columns: new[] { "Email", "PasswordHash", "LastModifiedOn" },
                values: new object[] { "admin@citiwatch.com", "$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", new DateTime(2025, 9, 24, 0, 0, 0, 0, DateTimeKind.Utc) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert the admin user back to original credentials
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("30000000-0000-0000-0000-000000000001"),
                columns: new[] { "Email", "PasswordHash", "LastModifiedOn" },
                values: new object[] { "SuperAdmin", "$2a$11$.vCYWiCOAuf.t/.fOGHGeeeEcTxmXeeBqGxQRoiMlkyrLmjJz0epu", new DateTime(2025, 8, 28, 0, 0, 0, 0, DateTimeKind.Utc) });
        }
    }
}
