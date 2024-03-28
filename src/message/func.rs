use scraper::{Html, Selector};
use rustrict::CensorIter;
use kuchikiki::traits::*;

pub fn into_censored_md(html: &str) -> String {
    let fragment = Html::parse_fragment(html);
    let selector = Selector::parse("p").unwrap();
    let root = fragment.select(&selector).next().unwrap();

    let nodes_text: Vec<String> = root.text().collect::<Vec<&str>>().iter().map(|&t| t.to_string()).collect();
    let mut nodes_char: Vec<char> = nodes_text.join("").chars().censor().collect::<Vec<char>>();

    let mut index = 0;
    let mut new_text: Vec<String> = vec![];
    while index < nodes_text.len() {
        let replacement: String = nodes_char.chunks_exact(nodes_text[index].len()).next().unwrap().iter().collect();
        new_text.push(replacement);
        nodes_char.drain(0..nodes_text[index].len());
        index += 1;
    }

    let document = kuchikiki::parse_html().one(html);
    for (index, text_node) in document.select("p").unwrap().next().expect("").as_node().descendants().text_nodes().enumerate() {
        text_node.replace(new_text[index].clone());
    }
    document.select_first("p").unwrap().as_node().to_string()
}