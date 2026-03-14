import Movie from "@/components/movie";
import type { MovieType } from "@/types/global";

async function fetchMovies(q: string): Promise<MovieType[]> {
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${q}`, {
		headers: {
			Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
		},
	});

    const data = await res.json();
    return data.results;
}

export default async function Search({
	searchParams,
}: {
	searchParams: Promise<{ q: string }>;
}) {
    const q = (await searchParams).q;
	const movies = await fetchMovies(q);

	return (
		<div>
			<h2 className="py-3 mb-4 border-b text-2xl font-bold">Search</h2>
			<div className="flex flex-row flex-wrap gap-4">
				{movies.map(movie => (
					<Movie
						key={movie.id}
						movie={movie}
					/>
				))}
			</div>
		</div>
	);
}
