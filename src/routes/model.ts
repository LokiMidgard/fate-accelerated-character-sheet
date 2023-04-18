import { browser } from "$app/environment";


export function updateCharacter(char: Character | undefined) {
    if (!browser || char == undefined) {
        return;
    }
    window.localStorage.setItem('fateCharacter', JSON.stringify(char));
}
export function loadCharacter() {
    if (!browser) {
        return undefined;
    }
    const data = window.localStorage.getItem('fateCharacter');
    if (data) {
        return JSON.parse(data);
    }
    return undefined
}

export function newChar() {
    return {
        name: '',
        description: '',
        aproaches: {
            careful: 0,
            clever: 0,
            flashy: 0,
            forceful: 0,
            quick: 0,
            sneaky: 0
        },
        aspects: {
            high: '',
            other: [''],
            trouble: ''
        },
        refresh: 0,
        fatePoints: 0,
        extras: [],
        stress: [false, false, false],
        stunts: [],
        consequences: {
            mild: '',
            moderate: '',
            server: ''
        }
    };

}

export const aproaches = [
    'careful',
    'clever',
    'flashy',
    'forceful',
    'quick',
    'sneaky',
] as const;
export type Aproach = typeof aproaches[number];

export type Character = {
    name: string,
    description: string,

    fatePoints: number,
    refresh: number,

    aspects: {
        high: string,
        trouble: string,
        other: string[]
    },
    aproaches: Record<Aproach, number>,
    stunts: string[],
    extras: string[],

    stress: [boolean, boolean, boolean],
    consequences: {
        mild: string,
        moderate: string,
        server: string,
    }
}