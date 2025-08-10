const { NotFoundError, BadRequestError } = require('../errors');
const Job = require('../models/Job');
const {StatusCodes, REQUESTED_RANGE_NOT_SATISFIABLE} = require('http-status-codes');

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy : req.user.id});
    res.status(StatusCodes.OK).json({jobs, count: jobs.length});
}

const getJob = async (req, res) => {
    jobId = req.params.id;
    userId = req.user.id;

    const job = await Job.findOne({_id : jobId, createdBy: userId});
    if(!job) {
        throw new NotFoundError("Job doesn't exist!!!!!!!");
    }
    res.status(StatusCodes.OK).json({job});
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.id;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job});
}

const updateJob = async (req, res) => {
    const {
        body: {company, position},
        user: {id: userId},
        params: {id: jobId}
    } = req;

    if (company == "" || position =="") {
        throw new BadRequestError("You must provide both company and pisition!");
    }

    const job = await Job.findOneAndUpdate(
        {_id: jobId, createdBy: userId}, 
        {company, position}, 
        {new: true, runValidators: true}
    );

    if(!job) {
        throw new NotFoundError("Job doesn't exist!!!!!!!");
    }
    res.status(StatusCodes.OK).json({job});
}

const deleteJob = async (req, res) => {

    const job = await Job.deleteOne({
        _id : req.params.id,
        createdBy : req.user.id 
    });

    if (!job) {
        throw new NotFoundError("Job doesn't exist!!!!!!!");
    }

    const allJobs = await Job.find({});
    res.status(StatusCodes.OK).json({jobs: {allJobs}, count: allJobs.length});
}



module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}