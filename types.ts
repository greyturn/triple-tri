export type Owner = 'red' | 'blue' | 'none';

export type JSONValue = string | number | boolean | JSONObject | JSONArray | null;

export interface JSONObject {
    [x: string]: JSONValue;
}

export interface JSONArray extends Array<JSONValue> {}

export interface CardDB {
    cards: Card[];
}

interface Card {
    id: string;
    top: number;
    right: number;
    left: number;
    bottom: number;
    type: string;
}
