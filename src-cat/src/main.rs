use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;
use std::fs;
use std::io::Write;
use text_io::read;

const HTMLPRE: &str = r#"<!doctype html>
<html>
<head>
<style>
td.createcol p {
	padding-left: 10em;
}

p{
	font-family: 'Segoe UI';
}
a {
	text-decoration: none;
    font-family: 'Segoe UI';
	color: black;
}

a:visited {
	color: grey;
}

table {
	border-collapse: collapse;
	max-width: 1000%;
	border: 1px solid grey;
}

table.center {
    margin-left:auto; 
    margin-right:auto;
}

tr, td {
	border-bottom: 2px solid green;
}

tr.end, td.end {
	border-bottom: 5px solid rgb(216, 216, 32);
}

td p {
	padding: 0.7em;
}

body {
	text-align:center;
	padding-top: 50px;
	margin:0;
}

tr:hover {
	background-color: lightgrey;
}

.sticky {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #CCCD;
  border-radius: 0px 0px 5px 5px;
}

</style>
</head>"#;

const HTMLSUF: &str = r#"
</table>
</body>
</html>"#;

fn main() -> std::io::Result<()> {
    let mn = nenter();
    let nlist = listout();
    let _ = fs::write("zday_sheet.html",HTMLPRE);
    let mut f = File::options().append(true).open("zday_sheet.html")?;
    for n in nlist.iter() {
        let t = webunsafe(&n);
        writeln!(&mut f, r#"<table class = "center">"#)?;
        writeln!(&mut f, r#"<tr><td><p><a target="_blank" href="https://www.nationstates.net/container={}/nation={}/nation={}?generated_by=gzps_by_garbelia_used_by_{}">{}</a></p></td>"#, n, n, n, mn, t)?;
        writeln!(&mut f, r#"<td><p><a target="_blank" href="https://www.nationstates.net/container={}/nation={}/nation={}/page=zombie_control?generated_by=gzps_by_garbelia_used_by_{}">zombie control</a></p></td>"#, n, n, n, mn)?;
        writeln!(&mut f, r#"<td><p><a target="_blank" href="https://www.nationstates.net/container={}/nation={}/page=zombies/region=forest?generated_by=gzps_by_garbelia_used_by_{}">region spotting</a></p></td>"#, n, n, mn)?;
        writeln!(&mut f, r#"<td><p><a target="_blank" href="https://www.nationstates.net/container={}/nation={}/page=zombies/region=forest?zaction-intended-export=on&zaction-intended-exterminate=on?generated_by=gzps_by_garbelia_used_by_{}">eject</a></p></td>"#, n, n, mn)?;
        writeln!(&mut f, r#"<td><p><a target="_blank" href="https://www.nationstates.net/container={}/nation={}/page=zombies/region=forest?zaction-export=on?generated_by=gzps_by_garbelia_used_by_{}">exporters</a></p></td>"#, n, n, mn)?;
        writeln!(&mut f, r#"<td><p><a target="_blank" href="https://www.nationstates.net/container={}/region=forest?generated_by=gzps_by_garbelia_used_by_{}">join forest</a></p></td>"#, n, mn)?;    
    }
    writeln!(&mut f, "</table>")?;
    writeln!(&mut f, "{}", HTMLSUF)?;
    Ok(())
}


fn nenter() -> String {
    print!("Please enter your main Nationstates nation: ");
    let nation: String = read!();
    return nation
}

fn webunsafe(st: &String) -> String {
    let s = str::replace(&st, "_", " ");
    let mut c = s.chars();
    match c.next() {
        None => String::new(),
        Some(f) => f.to_uppercase().chain(c).collect(),
    }
}

fn listout () -> Vec<String> {
    let mut nl = Vec::new();
    if let Ok(lines) = read_lines("nations.txt") {
        for line in lines.flatten() {
            let websafea = str::replace(&line, " ", "_");
            let websafeb = websafea.to_lowercase();
            let finalo = websafeb;
            nl.push(finalo);
        }
    }
    return nl
}

fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where P: AsRef<Path>, {
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}