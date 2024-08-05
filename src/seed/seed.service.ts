import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';



@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http : AxiosAdapter,

  ) { }

  //TODO con multiples inserciones
  async executeSeed() {
    await this.pokemonModel.deleteMany({}); //delete * from pokemons;

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      console.log(segments);
      const no = +segments[segments.length - 2];

      //const pokemon = await this.pokemonModel.create({name, no});
      pokemonToInsert.push({ name, no }); //[{name: 'bulbasaur', no: 1}]

    });

    this.pokemonModel.insertMany(pokemonToInsert);
    //insert into pokemons (name, no) 
    // (name: 'bulbasaur', no: 1),
    //  (name: 'ivysaur', no: 2),
    //   (name: 'venusaur', no: 3),

    return 'Seed executed';
  }
  //TODO sin multiples inserciones 
  // async executeSeed() {

  //   await this.pokemonModel.deleteMany({}); //delete * from pokemons;

  //   const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

  //   const insertPromisesArray = [];

  //   data.results.forEach(({ name, url }) => {
  //     const segments = url.split('/');
  //     console.log(segments);
  //     const no = +segments[segments.length - 2];

  //     //const pokemon = await this.pokemonModel.create({name, no});

  //     insertPromisesArray.push(
  //       this.pokemonModel.create({ name, no })
  //     )

  //   });
  //   await Promise.all(insertPromisesArray);

  //   return 'Seed executed';
  // }
}
