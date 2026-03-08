import { MovieType } from "@/types/global";

const posterUrl = "http://image.tmdb.org/t/p/w185";

export default async function Movie({ movie }: { movie: MovieType }) {
	return (
		<div className="w-46 flex flex-col gap-1 text-center">
			<img
				src={posterUrl + movie.poster_path}
				alt=""
			/>
			<div className="font-bold">{movie.title}</div>
			<span>{movie.release_date.split("-")[0]}</span>
		</div>
	);
}
