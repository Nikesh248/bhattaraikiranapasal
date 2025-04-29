
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center gap-2">
           <ShieldCheck className="h-6 w-6 text-primary" />
           <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Welcome to the admin area.</p>
          <p>This is a placeholder page. Add admin-specific components and functionality here.</p>
          {/* Add links to manage products, orders, users, etc. */}
        </CardContent>
      </Card>
    </div>
  );
}
