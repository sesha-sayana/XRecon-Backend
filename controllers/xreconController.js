const log = require("../logger");
const xrpl = require("xrpl");
const csv = require("csvtojson");
const helperXRPL = require("../helpers/xrpl");
const { sequelize, Sequelize } = require("../db/models");

exports.walletVerify = async (req, res, next) => {
  try {
    if (!req.file || req.file.fieldname !== "csv") {
      throw {
        details: [{ message: "Please upload the required file." }],
      };
    }
    const accounts = await csv({
      // noheader: true,
      // headers: ["a", "b", "c", "d", "e", "f"],
    }).fromString(req.file.buffer.toString() || Object.keys(accounts[0]));
    let headers = [];
    if (accounts.length === 0) {
      throw {
        details: [{ message: "Please upload a valid file." }],
      };
    } else {
      headers = Object.keys(accounts[0]);
      if (
        !headers.every((head, index) => head === ["account", "balance"][index])
      ) {
        throw {
          details: [{ message: "Please upload a valid file." }],
        };
      }
    }
    let request_array = accounts.map((account) => getBalance(account.account));
    let result_array = await Promise.all(request_array);
    result_array.forEach((result, index) => {
      accounts[index].is_valid_acc = result == "false" ? false : true;
      accounts[index].ledger_balance = Number(result);
      if (Number(result) > Number(accounts[index].balance)) {
        accounts[index].balance_diff =
          Number(result) - Number(accounts[index].balance);
      } else {
        accounts[index].balance_diff =
          Number(accounts[index].balance) - Number(result);
      }
      accounts[index].balance_diff_percent = Number(
        ((accounts[index].balance_diff / Number(result)) * 100).toFixed(2)
      );
    });
    return res.status(200).send({ status: true, accounts });
  } catch (err) {
    if (err.details) {
      return res
        .status(400)
        .send({ status: false, message: err.details[0].message });
    } else {
      log.error(err);
      return res.status(500).send({
        status: false,
        message: err.message ? err.message : "Internal Server Error.",
      });
    }
  }
};

async function getBalance(address) {
  try {
    let balance = await helperXRPL.getAccBalance(address);
    return balance;
  } catch (error) {
    return "false";
  }
}
