use telechir_agent::AgentConfig;

fn main() {
    let config = AgentConfig::default();

    if let Err(error) = config.validate() {
        eprintln!("telechir-agent configuration error: {error}");
        std::process::exit(2);
    }

    println!(
        "telechir-agent {} core ready (protocol {})",
        env!("CARGO_PKG_VERSION"),
        config.protocol_version
    );
}
