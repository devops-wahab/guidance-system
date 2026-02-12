import { getAllUsers } from "@/lib/admin-actions";
import { UserManagementTable } from "@/components/admin/UserManagementTable";

export default async function UsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage students, advisors, and administrators
        </p>
      </div>

      <UserManagementTable initialUsers={users} />
    </div>
  );
}
