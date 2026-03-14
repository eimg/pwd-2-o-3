import type { MovieType, PersonType } from "@/types/global";
import Link from "next/link";

async function fetchMovie(id: string): Promise<MovieType> {
	const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
		headers: {
			Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
		},
	});

	return await res.json();
}

async function fetchCasts(id: string): Promise<PersonType[]> {
	const res = await fetch(
		`https://api.themoviedb.org/3/movie/${id}/credits`,
		{
			headers: {
				Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
			},
		},
	);

	const data = await res.json();
	return data.cast;
}

const profileUrl = "http://image.tmdb.org/t/p/w185";
const backdropUrl = "http://image.tmdb.org/t/p/w1280";

export default async function ViewMovie({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const movie = await fetchMovie(id);
	const casts = await fetchCasts(id);

	return (
		<div>
			<h2 className="py-3 mb-4 border-b text-2xl font-bold">
				{movie.title} ({movie.release_date.split("-")[0]})
			</h2>
			<img
				src={backdropUrl + movie.backdrop_path}
				alt=""
			/>
			<p className="text-xl mt-3 mb-6">{movie.overview}</p>

			<h3 className="py-3 mb-4 border-b text-xl font-bold">Cast</h3>
			<div className="flex gap-3 flex-wrap">
				{casts.map(cast => {
					return (
						<div
							key={cast.id}
							className="w-46 flex flex-col gap-1 text-center">
							{cast.profile_path ? (
								<Link href={`/person/${cast.id}`}>
									<img
										src={profileUrl + cast.profile_path}
										alt=""
									/>
								</Link>
							) : (
								<div className="bg-gray-300 h-69"></div>
							)}
							<div className="font-bold">
								<Link href={`/person/${cast.id}`}>
									{cast.name}
								</Link>
							</div>
							<span className="text-gray-600">
								{cast.character}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
