import { Request, Response } from "express";
import * as cache from "memory-cache";
import { AppDataSource } from "../data-source";
import { Movie } from "../entity/Movies.entity";

export class MovieController {
  static async getAllMovies(req: Request, res: Response) {
    const data = cache.get("movies");
    if (data) {
      console.log("serving from cache");
      return res.status(200).json({
        data,
      });
    } else {
      console.log("serving from db");
      const movieRepository = AppDataSource.getRepository(Movie);
      const movies = await movieRepository.find();
      cache.put("movies", movies, 10000);
      return res.status(200).json({
        data: movies,
      });
    }
  }
  static async createMovie(req: Request, res: Response) {
    const { title, description, director, year, rating, image, cast } =
      req.body;
    const movie = new Movie();
    movie.title = title;
    movie.description = description;
    movie.director = director;
    movie.year = year;
    movie.rating = rating;
    movie.image = image;
    movie.cast = cast;
    if (!title || !description || !director || !year || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const movieRepository = AppDataSource.getRepository(Movie);
    await movieRepository.save(movie);
    return res
      .status(200)
      .json({ message: "Movie created successfully", movie });
  }

  static async updateMovie(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, director, year, rating, image, cast } =
      req.body;
    const movieRepository = AppDataSource.getRepository(Movie);
    const movie = await movieRepository.findOne({
      where: { id },
    });
    movie.title = title;
    movie.description = description;
    movie.director = director;
    movie.year = year;
    movie.rating = rating;
    movie.image = image || "https://example.com/default.jpg";
    movie.cast = cast;
    await movieRepository.save(movie);
    return res
      .status(200)
      .json({ message: "Movie updated successfully", movie });
  }

  static async deleteMovie(req: Request, res: Response) {
    const { id } = req.params;
    const movieRepository = AppDataSource.getRepository(Movie);
    const movie = await movieRepository.findOne({
      where: { id },
    });
    await movieRepository.remove(movie);
    cache.del("movies");
    return res
      .status(200)
      .json({ message: "Movie deleted successfully", movie });
  }
}
