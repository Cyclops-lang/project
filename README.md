//first draft 


# Cyclops-lang
A C-like language with JS-powered logic, numeric polarity branching, and deterministic flow.

Cyclops is a lightweight, C-style programming language designed for clarity, predictability, and real-world automation. It looks like C, feels like C, and behaves like a numeric decision engine — powered by JavaScript, web functions, masks, and polarity-based branching.

Cyclops is ideal for:
- deterministic workflows
- automation scripts
- trading logic
- signal processing
- web-driven programs
- educational examples
- numeric decision engines

Cyclops is intentionally small, readable, and easy to learn for anyone familiar with C-like languages.

## Features
- C-style syntax — braces, blocks, declarations, printf, and familiar flow.
- JS integration — call JavaScript functions directly from Cyclops.
- Web functions — fetch text, scrape pages, and process remote data.
- String functions — slice, convert, and manipulate text using JS.STRING.
- Math functions — polarity-based maths returning 1 or -1.
- Polarity branching — TRUE = 1, FALSE = -1, enabling numeric flow control.
- goto routing — deterministic branching using numeric polarity.
- Labels — simple, readable flow nodes for structured control.

## if - goto branching 

int x, i;
float r;
int main(){
I=1;
:loop{
    r = JS.MATH random;
    printf("%f\n", r);
    i = i + 1;
}
x = JS.IF("i < 6");
goto(x, loop, quit);
return 0;
}

## Polarity Branching (Core Concept)
Cyclops does not use boolean keywords. Instead, it uses numeric polarity:

TRUE = 1  
FALSE = -1

Any function that returns ±1 can directly control program flow:

pm = JS.MATH sign, t4;
goto(pm, sub_buy, sub_hold);

This makes maths functions act as flow routers, enabling:
- trading engines
- signal processors
- threshold logic
- numeric decision trees
- physics-style push/pull control

## Example Program: Crypto Price Decision Engine
This example fetches Bitcoin’s price, computes future projections, calculates an average, and uses JS.MATH sign to decide whether to BUY or HOLD.

float p1, p2, p3, p4;
float p5;
float avg, limit, diff;
float t1, t2, t3, t4;
float l1;
float f1, f2, f3, f4;
int pm, signal;

int main() {
    string data;
    string tail;
    string priceStr;

    data = JS.WEB getText,"https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";

    tail = data + 18;
    priceStr = JS.STRING strncpy, tail, 5;
    p5 = JS.STRING tofloat, priceStr;

    printf("Current price: %f\n", p5);

    f1 = p5 * 1.03; p1 = f1;
    f2 = p5 * 1.04; p2 = f2;
    f3 = p5 * 1.05; p3 = f3;
    f4 = p5 * 1.06; p4 = f4;

    printf("Future price 1: %f\n", p1);
    printf("Future price 2: %f\n", p2);
    printf("Future price 3: %f\n", p3);
    printf("Future price 4: %f\n", p4);

    t1 = p1 + p2;
    t2 = t1 + p3;
    t3 = t2 + p4;

    avg = t3 / 4;
    l1 = avg * 0.03;
    limit = l1;

    diff = avg - p5;
    t4 = diff - limit;

    pm = JS.MATH sign, t4;
    signal = pm;

    goto(signal, sub_buy, sub_hold);

    :sub_buy {
        printf("BUY\n");
    }

    :sub_hold {
        printf("HOLD\n");
    }

    return 0;
}

## Basic Syntax Overview

### Labels
:loop {
    ...
}

### Goto Routing
goto(x, branch_true, branch_false);

### JS Integration
r = JS.MATH random;
data = JS.WEB getText,"https://example.com";
value = JS.STRING tofloat, str;

### C-style Structure
int main() {
    printf("Hello Cyclops\n");
    return 0;
}

## Installation
Cyclops is distributed as a lightweight interpreter.

### Build
make

### Run
./cyclops program.cyc

## Project Goals
Cyclops aims to be:
- simple
- deterministic
- C-like
- JS-powered
- easy to embed
- easy to extend

Long-term goals include:
- masks
- async JS bridges
- future-price engines
- web automation
- numeric decision frameworks
- Lua-style neutral foundation governance

## Contributing
Cyclops welcomes:
- examples
- documentation improvements
- interpreter enhancements
- JS integration modules
- maths functions
- polarity utilities

## License
Cyclops-lang is open-source under a permissive license suitable for industrial, educational, and automation use.
