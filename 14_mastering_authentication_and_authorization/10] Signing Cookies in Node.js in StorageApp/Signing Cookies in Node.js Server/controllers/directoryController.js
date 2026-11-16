import { rm } from "fs/promises";
import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";

export const getDirectoryById = async (req, res) => {
  const user = req.user;
  const _id = req.params.id || user.rootDirId.toString();

  const directoryData = await Directory.findOne({ _id }).lean();

  if (!directoryData) {
    return res
      .status(404)
      .json({ error: "Directory not found or you do not have access to it!" });
  }

  const files = await File.find({ parentDirId: directoryData._id }).lean();
  const directories = await Directory.find({ parentDirId: _id }).lean();

  return res.status(200).json({
    ...directoryData,
    files: files.map((file) => ({ ...file, id: file._id })),
    directories: directories.map((dir) => ({ ...dir, id: dir._id })),
  });
};

export const createDirectory = async (req, res, next) => {
  const user = req.user;

  const parentDirId = req.params.parentDirId || user.rootDirId.toString();
  const dirname = req.headers.dirname || "New Folder";

  try {
    const parentDir = await Directory.findOne({ _id: parentDirId }).lean();

    if (!parentDir)
      return res
        .status(404)
        .json({ message: "Parent Directory Does not exist!" });

    await Directory.insertOne({
      name: dirname,
      parentDirId,
      userId: user._id,
    });
    return res.status(200).json({ message: "Directory Created!" });
  } catch (err) {
    next(err);
  }
};

export const renameDirectory = async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const { newDirName } = req.body;

  try {
    await Directory.findOneAndUpdate(
      { _id: id, userId: user._id },
      { name: newDirName },
    );

    res.status(200).json({ message: "Directory Renamed!" });
  } catch (err) {
    next(err);
  }
};

export const deleteDirectory = async (req, res, next) => {
  const { id } = req.params;

  try {
    // check if dir exists and belongs to logged in user
    const directoryData = await Directory.findOne({
      _id: id,
      userId: req.user._id,
    })
      .select("_id")
      .lean();

    if (!directoryData) {
      return res.status(404).json({ error: "Directory not found!" });
    }

    // function to get nested data from directories
    async function getDirectoryContents(id) {
      // fetch only required directory data from db
      let directories = await Directory.find({ parentDirId: id })
        .select("_id")
        .lean();

      // fetch only required files data from db
      let files = await File.find({ parentDirId: id })
        .select("_id extension")
        .lean();

      // recursively call function and add all nested files and directories to files and directory array
      for (const { _id } of directories) {
        const { files: childFiles, directories: childDirectories } =
          await getDirectoryContents(_id);

        files = [...files, ...childFiles];
        directories = [...directories, ...childDirectories];
      }

      // return all nested files and directories
      return { files, directories };
    }

    // recursively get all nested files and directories
    const { files, directories } = await getDirectoryContents(id);

    // delete all files from stroage folder on server
    for (const { extension, _id } of files) {
      await rm(`./storage/${_id.toString()}${extension}`);
    }

    // delete all files from database
    await File.deleteMany({
      _id: { $in: files.map(({ _id }) => _id) },
    });

    // delete all directories + parent directory from database
    await Directory.deleteMany({
      _id: { $in: [...directories.map(({ _id }) => _id), id] },
    });
  } catch (error) {
    next(error);
  }
  return res.json({ message: "Files deleted successfully" });
};
