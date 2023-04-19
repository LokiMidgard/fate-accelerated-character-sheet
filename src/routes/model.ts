import { browser } from "$app/environment";


export function updateCharacter(char: Character | undefined, id: string | undefined) {
    if (!browser || char == undefined || id == undefined) {
        return;
    }
    window.localStorage.setItem(`fateCharacter:${id}`, JSON.stringify(char));
}
export function loadCharacter(id: string): Character | undefined {
    if (!browser) {
        return undefined;
    }

    const data = id
        ? window.localStorage.getItem(`fateCharacter:${id}`)
        : window.localStorage.getItem(Array.from(window.localStorage).map((_, i) => window.localStorage.key(i)).filter(x => x?.startsWith('fateCharacter:'))[0] ?? '')
        ;
    if (data) {
        return JSON.parse(data);
    }
    return undefined
}


function getChild(params: unknown): string[] {
    if (typeof params == 'string') {
        return [params].filter(x => x.length > 0);
    } else if (typeof params == 'object') {
        if (params == null) {
            return [];
        } else if (Array.isArray(params)) {
            return params.flatMap(getChild).filter(x => x.length > 0);
        } else {
            return Object.values(params).flatMap(getChild).filter(x => x.length > 0);
        }
    }
    return [];
}

export function getAllIds(): (readonly [string, string])[] {
    if (!browser) {
        return [];
    }
    const keys = Array.from(window.localStorage).map((_, i) => window.localStorage.key(i)).filter(x => x?.startsWith('fateCharacter:')).filter((x): x is string => typeof x == 'string');
    return keys.map(key => {
        // const item = window.localStorage.getItem(key) as Character | null;

        let item: Character | null = null;
        try {
            const d = window.localStorage.getItem(key);
            if (d)
                item = JSON.parse(d) as Character | null;

        } catch (error) {
            //
        }

        return [key.substring('fateCharacter:'.length), item] as const;
    })
        .filter(([key, char]) => {

            console.log(char);
            console.log(getChild(char));

            return char
                && getChild(char).length > 0;

        })

        .map(([key, char]) => {

            return [key, char?.name ?? "NOT SET"] as const;

        });
}

export function newChar(): Character {
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