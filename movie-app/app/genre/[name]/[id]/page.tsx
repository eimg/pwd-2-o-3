import type { MovieType } from "@/types/global";
import Movie from "@/components/movie";

async function fetchMovies(id: string): Promise<MovieType[]> {
	const res = await fetch(
		`https://api.themoviedb.org/3/discover/movie?with_genres=${id}`,
		{
			headers: {
				Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
			},
		},
	);

	const data = await res.json();
	return data.results;
}

export default async function Genre({
	params,
}: {
	params: Promise<{ name: string; id: string }>;
}) {
	const { name, id } = await params;
	const movies = await fetchMovies(id);

	return (
		<div>
			<h2 className="py-3 mb-4 border-b text-2xl font-bold">{name}</h2>
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
