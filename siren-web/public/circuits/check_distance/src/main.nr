use dep::std;

fn main(lat1: pub u64, lon1: pub u64, lat2: pub u64, lon2: pub u64) {
    // Threshold is 1 km, scaled to 1000
    let threshold: u64 = 1_000;

    let distance: u64 = calculate_distance(lat1, lon1, lat2, lon2);
    assert(distance >= threshold);
}

fn calculate_distance(lat1: u64, lon1: u64, lat2: u64, lon2: u64) -> u64 {
    // Calculate absolute differences
    let d_lat: u64 = if lat2 >= lat1 {
        lat2 - lat1
    } else {
        lat1 - lat2
    };
    let d_lon: u64 = if lon2 >= lon1 {
        lon2 - lon1
    } else {
        lon1 - lon2
    };

    // Convert degree differences to approximate kilometers
    // 1 degree is roughly 111 km, so we multiply by 111 and divide by 1000 (the scale factor)
    let d_lat_km: u64 = d_lat * 111 / 1000;
    let d_lon_km: u64 = d_lon * 111 / 1000;

    // Use Manhattan distance as a simple approximation
    d_lat_km + d_lon_km
}

#[test]
fn test_main() {
    // Example coordinates scaled by 1000
    let lat1 = 52_520; // 52.520 degrees
    let lon1 = 13_405; // 13.405 degrees

    let lat2 = 48_857; // 48.857 degrees
    let lon2 = 2_352; // 2.352 degrees
    main(lat1, lon1, lat2, lon2);
}
