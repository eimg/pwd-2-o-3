import { MovieType } from "@/types/global";
import Link from "next/link";

const posterUrl = "http://image.tmdb.org/t/p/w185";

export default async function Movie({ movie }: { movie: MovieType }) {
	return (
		<div className="w-46 flex flex-col gap-1 text-center">
			<Link href={`/view/${movie.id}`}>
				<img
					className="hover:scale-105 transition-all"
					src={posterUrl + movie.poster_path}
					alt=""
				/>
			</Link>
			<div className="font-bold">
				<Link href={`/view/${movie.id}`}>{movie.title}</Link>
			</div>
			<span>{movie.release_date.split("-")[0]}</span>
		</div>
	);
}
