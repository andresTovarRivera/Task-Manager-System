using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskSystem.Server.Migrations
{
    /// <inheritdoc />
    public partial class ModifiedTaskEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "Tasks",
                newName: "User_id");

            migrationBuilder.RenameColumn(
                name: "updated_time",
                table: "Tasks",
                newName: "Updated_time");

            migrationBuilder.RenameColumn(
                name: "is_completed",
                table: "Tasks",
                newName: "Is_completed");

            migrationBuilder.RenameColumn(
                name: "created_time",
                table: "Tasks",
                newName: "Created_time");

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Tasks",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Order",
                table: "Tasks");

            migrationBuilder.RenameColumn(
                name: "User_id",
                table: "Tasks",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "Updated_time",
                table: "Tasks",
                newName: "updated_time");

            migrationBuilder.RenameColumn(
                name: "Is_completed",
                table: "Tasks",
                newName: "is_completed");

            migrationBuilder.RenameColumn(
                name: "Created_time",
                table: "Tasks",
                newName: "created_time");
        }
    }
}
