const logs = [
    {
        version: "Alpha 1.0",
        date: "Oct 8, 2025",
        features: [
            "Session can now be deleted. PRs will roll back with the deleted sets.",
            "Navbar now uses a hamburger menu for mobile",
            "Added 'Remember Exercise' and 'Remember Weight' to speed up logging.",
            "Bar graph now has horizontal scroll to avoid squishing.",
            "Volume graph filters now collapse with the graph",
            "Bars on the graph are now ordered properly."
        ],
        bugs: [
            "Routines are now added in sessions in the correct order.",
            "Sets can now hit PRs when using 0 weight."
        ],
        other: [
            "Added a ton of code tests to make updates smoother."
        ]
    },
];

export default logs;