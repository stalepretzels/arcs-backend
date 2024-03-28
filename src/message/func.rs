use rustrict::CensorIter;
use kuchikiki::traits::*;
use std::cell::RefCell;

pub fn into_censored_md(html: &str) -> String {
    let document = kuchikiki::parse_html().one(html);

    let nodes_text: Vec<String> = document.descendants().text_nodes().map(|text| {<RefCell<String> as Clone>::clone(&text).into_inner()}).collect();
    let mut nodes_char: Vec<char> = nodes_text.join("").chars().censor().collect::<Vec<char>>();

    let mut index = 0;
    let mut new_text: Vec<String> = vec![];
    while index < nodes_text.len() {
        let replacement: String = nodes_char.chunks_exact(nodes_text[index].len()).next().unwrap().iter().collect();
        new_text.push(replacement);
        nodes_char.drain(0..nodes_text[index].len());
        index += 1;
    }

    for (index, text_node) in document.descendants().text_nodes().enumerate() {
        text_node.replace(new_text[index].clone());
    }
    document.to_string()
}