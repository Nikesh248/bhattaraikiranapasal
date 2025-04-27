export default function Footer() {
  return (
    <footer className="bg-secondary mt-12 py-6">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Bhattarai Kirana Pasal. All rights reserved.
      </div>
    </footer>
  );
}
