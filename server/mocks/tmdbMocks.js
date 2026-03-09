const tmdbMocks = {
    trending: {
        results: [
            { id: 1, title: "Mock Movie: The Offline Adventure", poster_path: null, release_date: "2024-01-01", vote_average: 8.5, overview: "You are currently offline. This is mock data." },
            { id: 2, title: "Mock Movie: No Signal", poster_path: null, release_date: "2024-02-02", vote_average: 7.2, overview: "Watching movies while disconnected." }
        ]
    },
    popular: {
        results: [
            { id: 3, title: "Mock Popular Movie", poster_path: null, release_date: "2024-03-03", vote_average: 9.0, overview: "Everyone is watching this (offline)." }
        ]
    },
    toprated: {
        results: [
            { id: 4, title: "Mock Top Rated", poster_path: null, release_date: "2023-12-12", vote_average: 9.9, overview: "The best mock movie ever." }
        ]
    },
    tvshows: {
        results: [
            { id: 5, name: "Mock TV Show", poster_path: null, first_air_date: "2024-04-04", vote_average: 8.0, overview: "A show about no internet." }
        ]
    },
    upcoming: {
        results: [
            { id: 6, title: "Mock Upcoming", poster_path: null, release_date: "2025-01-01", vote_average: 0, overview: "Coming soon to your local mock server." }
        ]
    }
};

module.exports = tmdbMocks;
