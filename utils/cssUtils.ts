type Padding = {
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
};

type Margin = {
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
};

export const padding = (a: number, b?: number, c?: number, d?: number): Padding => ({
    paddingTop: a,
    paddingRight: b ?? a,
    paddingBottom: c ?? a,
    paddingLeft: d ?? b ?? a
});

export const margin = (a: number, b?: number, c?: number, d?: number): Margin => ({
    marginTop: a,
    marginRight: b ?? a,
    marginBottom: c ?? a,
    marginLeft: d ?? b ?? a
});

export const border = (width: number, color: string, radius?: number) => ({
    borderWidth: width,
    borderColor: color,
    borderRadius: radius
});
