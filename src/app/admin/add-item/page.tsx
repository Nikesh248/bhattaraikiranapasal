
'use client'; // Add 'use client' because we'll add state/interaction for the file input

import { useState } from 'react'; // Import useState
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Import Button
import { Input } from "@/components/ui/input"; // Import Input
import { Label } from "@/components/ui/label"; // Import Label
import { PackagePlus, Upload } from "lucide-react"; // Import Upload icon
import { useToast } from '@/hooks/use-toast'; // Import useToast

// TODO: Implement admin authentication check here

export default function AddItemPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      toast({
        title: "File Selected",
        description: `Selected file: ${event.target.files[0].name}`,
      });
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // TODO: Implement form submission logic
      // This would involve collecting all form data (name, price, etc.)
      // and the selectedFile, then likely using a Server Action
      // to upload the file to storage and save product details to a database.
      console.log("Form submitted. Selected file:", selectedFile);
      toast({
        title: "Submit Clicked (Mock)",
        description: "Implement server action for actual item addition and image upload.",
      });
  };


  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center gap-2">
           <PackagePlus className="h-6 w-6 text-primary" />
           <CardTitle className="text-2xl font-bold">Add New Item</CardTitle>
        </CardHeader>
        <CardContent>
           <p className="text-muted-foreground mb-6">Fill in the details below to add a new product to the store.</p>
            {/* TODO: Replace this with a proper ShadCN form */}
            <form onSubmit={handleSubmit} className="space-y-4">
               {/* Example fields - replace with actual form inputs */}
                <div>
                  <Label htmlFor="productName">Product Name</Label>
                  <Input id="productName" type="text" placeholder="e.g., Organic Apples" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" type="text" placeholder="e.g., Fresh and juicy..." required />
                </div>
                 <div>
                  <Label htmlFor="price">Price (Rs.)</Label>
                  <Input id="price" type="number" step="0.01" placeholder="e.g., 2.50" required />
                </div>
                <div>
                   <Label htmlFor="category">Category</Label>
                   {/* TODO: Use a Select component here */}
                   <Input id="category" type="text" placeholder="e.g., Groceries" required />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input id="stock" type="number" placeholder="e.g., 100" required />
                </div>

               {/* Image Upload Section */}
               <div className="space-y-2">
                 <Label htmlFor="productImage">Product Image</Label>
                 <div className="flex items-center gap-2">
                    <Input
                      id="productImage"
                      type="file"
                      accept="image/*" // Accept only image files
                      onChange={handleFileChange}
                      className="flex-grow file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-input file:bg-background file:hover:bg-accent file:hover:text-accent-foreground"
                    />
                    {/* Optional: Button to trigger file input */}
                    {/* <Button type="button" variant="outline" size="icon" onClick={() => document.getElementById('productImage')?.click()}>
                       <Upload className="h-4 w-4" />
                       <span className="sr-only">Upload Image</span>
                    </Button> */}
                 </div>
                 {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-2">Selected: {selectedFile.name}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Upload an image for the product (e.g., JPG, PNG).</p>
               </div>


               <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6">
                 Add Product
               </Button>
            </form>

           <p className="mt-6 text-sm text-muted-foreground">
             Note: Actual image upload and database saving require backend implementation (Server Action).
           </p>

        </CardContent>
      </Card>
    </div>
  );
}
