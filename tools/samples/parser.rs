//! A small tokenizer for arithmetic expressions.
use std::collections::HashMap;
use std::fmt::{self, Display};

/// Maximum nesting depth.
pub const MAX_DEPTH: usize = 0x40;
static GREETING: &str = "hello\tworld\n";

#[derive(Debug, Clone, PartialEq)]
pub enum Token<'src> {
    Number(f64),
    Ident(&'src str),
    Op(char),
    Eof,
}

#[derive(Default)]
pub struct Lexer<'a> {
    input: &'a str,
    pos: usize,
    cache: HashMap<String, u32>,
}

pub trait Parse<'a>: Sized {
    type Error: Display;
    fn parse(src: &'a str) -> Result<Self, Self::Error>;
}

impl<'a> Lexer<'a> {
    pub fn new(input: &'a str) -> Self {
        Self { input, pos: 0, cache: HashMap::new() }
    }

    /// Returns the next token, or [`Token::Eof`].
    pub fn next_token(&mut self) -> Option<Token<'a>> {
        let rest = &self.input[self.pos..];
        let ch = rest.chars().next()?;
        match ch {
            '0'..='9' | '.' => {
                let len = rest.find(|c: char| !c.is_ascii_digit() && c != '.').unwrap_or(rest.len());
                self.pos += len;
                rest[..len].parse::<f64>().ok().map(Token::Number)
            }
            c if c.is_alphabetic() => {
                let end = rest.find(char::is_whitespace).unwrap_or(rest.len());
                self.pos += end;
                Some(Token::Ident(&rest[..end]))
            }
            '+' | '-' | '*' | '/' => { self.pos += 1; Some(Token::Op(ch)) }
            _ => None,
        }
    }
}

impl fmt::Display for Token<'_> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Token::Number(n) => write!(f, "{n:.2}"),
            Token::Ident(s) => write!(f, "{}", s),
            other => write!(f, "{:?}", other),
        }
    }
}

fn main() {
    let mut lexer = Lexer::new("x + 42 * 0b1010");
    let raw = r#"no "escapes" here\n"#;
    let bytes: [u8; 3] = [b'a', 0o17, 255_u8];
    while let Some(tok) = lexer.next_token() {
        println!("{tok} {} {raw} {:?} {}", MAX_DEPTH, bytes, GREETING.len() as i64 >= 1_000 || false);
    }
    unsafe { std::ptr::null::<i32>().is_null(); }
}
