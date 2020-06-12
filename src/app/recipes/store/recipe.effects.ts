import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as RecipeActions from './recipe.actions';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
 
@Injectable()
export class RecipeEffects {
 
  fetchRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipeActions.fetchRecipes),
      withLatestFrom(this.store.select('recipes')),
      switchMap(() => {
        return this.http
          .get<Recipe[]>(
            'https://recipe-book-4ba1b.firebaseio.com/recipes.json'
          );
      }),
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      map(recipes => {
        return RecipeActions.setRecipes({recipes});
      })
    )
  );
 
  storeRecipes$ = createEffect(() =>
      this.actions$.pipe(
        ofType(RecipeActions.storeRecipes),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesState]) => {
          return this.http.put(
            'https://recipe-book-4ba1b.firebaseio.com/recipes.json',
            recipesState.recipes
          );
        })
      ),
    {dispatch: false}
  );
 
  constructor(private actions$: Actions, private http: HttpClient,
              private store: Store<fromApp.AppState>) {
  }
 
}