export const randomRange = (min, max) => {
    const min_ = max < min ? max : min
    const max_ = min > max ? min : max
    return (max_ - min_) * Math.random() + min_
}

export const deg2rad = deg => deg * Math.PI / 180

export const distance2d = (x1, y1, x2, y2) => {
    const dx_ = x2 - x1 // différence des abscisses (x)
    const dy_ = y2 - y1  // différence des ordonnées (y)
    return Math.hypot(dx_, dy_)
}

export const clamp = (value, min, max) => {
    const min_ = max < min ? max : min
    const max_ = min > max ? min : max
    value = value > max_ ? max_ : value
    value = value < min_ ? min_ : value
    return value
}