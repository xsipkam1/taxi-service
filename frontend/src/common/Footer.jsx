export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="text-center border mt-auto py-4 fs-5 d-none d-md-block " style={{ backgroundColor: 'white' }}>
            TAXIserv &copy; {currentYear}
        </footer>
    );
}