import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

public gifList: Gif[] = [];

private _tagsHistory : string[] = [];
private  apiKey      : string = 'Df3BjhyF8NdpBYiNDi5FB3zmc3l9fTvy';
private serviceUrl   : string = 'https://api.giphy.com/v1/gifs';



  constructor( private http: HttpClient ) {
    this.loadLocalStorage();
    console.log('Gifs service ready');
   }

  get tagsHistory (){

    return [...this._tagsHistory];

  }

  //* se aplica la logica del la lista
  private organizeHistory( tag: string ){
    // se pasa a minusculas
    tag = tag.toLowerCase();
   // se compara si lo que se tecleo es igual a lo que tenemos , lo elimina
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter( (oldTag)=> oldTag !== tag )
    }
    //se inserta el nuevo tag o lista
    this._tagsHistory.unshift(tag);
    //se delimita a solo 10 elementos de la lista
    this._tagsHistory =  this._tagsHistory.splice(0,10);

    //se guarda en el local Storge
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void{
    localStorage.setItem('history', JSON.stringify(this._tagsHistory))
  }

  private loadLocalStorage(): void{

    if( !localStorage.getItem('history') ) return;

    this._tagsHistory = JSON.parse( localStorage.getItem('history')!);

    if( this._tagsHistory.length === 0 ) return;
    this.searchTag(this._tagsHistory[0]);

  }



  searchTag( tag: string){

    if ( tag.length === 0 ) return;

    this.organizeHistory( tag );

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag);

    this.http.get<SearchResponse>(`${ this.serviceUrl}/search`,{ params })
        .subscribe(resp =>{
          this.gifList = resp.data;
          console.log({gifs : this.gifList});
        });

   // this._tagsHistory.unshift(tag);
   // console.log(this.tagsHistory);
  }

}
