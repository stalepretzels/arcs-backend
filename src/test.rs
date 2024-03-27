use scraper::{Html,Selector};
use rustrict::CensorIter;
use kuchikiki::{traits::*,NodeDataRef};
use std::cell::RefCell;

fn main() {
    let html = "<p>as<em>shole</em></p>";
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
    println!("{:?}", new_text);

    let document = kuchikiki::parse_html().one(html);
    index = 0;
    for mut text_node in document.select("p").unwrap().next().expect("").as_node().descendants().text_nodes() {
        text_node = NodeDataRef::new(text_node.as_node().clone(), |_| &RefCell::new(new_text[index].clone()));
        println!("{:?}", text_node);
    }
}
/*
fn node_iter(mut html: Vec<Node>, i: usize, text: Vec<String>) -> Vec<Node> {

    /* note to self: what the hell is this supposed to do
        - take vector of nodes
        - take censored text (asshole -> a******)
        - replace text in vector of nodes with censored counterpart
    */

    for (index, mut node) in html.iter_mut().enumerate() {
        match node {
            Node::Text(test) => {*test =/*&mut Node::Text(*/text[i].clone()/*)*/;},
            Node::Element(test) => {
                for (index, mut node) in test.children.iter().enumerate() {
                    node = &node_iter(test.children.clone(), i, text.clone())[0];
                }
                node = &mut Node::Element(test.clone());
            },
            _ => {}
        }
    }
    return html;
}*/