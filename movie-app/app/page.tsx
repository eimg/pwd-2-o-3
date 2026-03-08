import Movie from "@/components/movie";
import type { MovieType } from "@/types/global";

async function fetchPopular(): Promise<MovieType[]> {
	const res = await fetch("https://api.themoviedb.org/3/movie/popular", {
		headers: {
			Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
		},
	});

	const data = await res.json();
	return data.results;
}

async function fetchTopRated(): Promise<MovieType[]> {
	const res = await fetch("https://api.themoviedb.org/3/movie/top_rated", {
		headers: {
			Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
		},
	});

	const data = await res.json();
	return data.results;
}

export default async function Home() {
	const popular = await fetchPopular();
    const top = await fetchTopRated();

	return (
		<div>
			<h2 className="py-3 mb-4 border-b text-2xl font-bold">Popular</h2>
			<div className="flex flex-row flex-wrap gap-4">
				{popular.map(movie => (
					<Movie
						key={movie.id}
						movie={movie}
					/>
				))}
			</div>

			<h2 className="mt-6 py-3 mb-4 border-b text-2xl font-bold">Top Rated</h2>
			<div className="flex flex-row flex-wrap gap-4">
				{top.map(movie => (
					<Movie
						key={movie.id}
						movie={movie}
					/>
				))}
			</div>
		</div>
	);
}
