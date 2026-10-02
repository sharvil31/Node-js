export default function (req, res, next, id) {
const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  if (!UUID_REGEX.test(id)) {
    return res.status(400).json({ error: `Invalid ID: ${id}` });
  }
  next();
}
