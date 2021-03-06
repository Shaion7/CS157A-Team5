import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Container, Row, Col, Table } from "react-bootstrap";

import "./css/Home.css";
import MyNavbar from "./MyNavbar";
import axios from "axios";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const history = useHistory();

  // all the items that are in item table
  const [userItemsOnSale, setUserItemsOnSale] = useState([]);

  const [userBids, setUserBids] = useState([]);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    getUserBids();
    getAllUserItemsOnSale();

    const interval = setInterval(() => {
      checkIfItemExpired();
    }, 7000);
    setReset(false);
    return () => {
      clearInterval(interval);
    };
  }, [reset]);

  const checkIfItemExpired = () => {
    axios
      .post("http://localhost:8080/api/handleExpiredAndSoldItems", {
        username: user.username,
      })
      .then((res) => {
        let items = res.data;

        if (items.length < userItemsOnSale.length) {
          const expiredItems = userItemsOnSale.filter((el) => {
            return !items.find((element) => {
              return element.name === el.name;
            });
          });

          /* Get Expired Item Names */
          let expiredItemNames = "";
          for (let i = 0; i < expiredItems.length; i++) {
            expiredItemNames = expiredItemNames + expiredItems[i].name + "\n";
          }

          /* Alert user which items have expired */
          alert("The following item(s) have expired: \n" + expiredItemNames);
        }
        setReset(true);
      });
  };

  const getAllUserItemsOnSale = () => {
    const username = {
      username: user.username,
    };
    axios
      .post("http://localhost:8080/api/handleExpiredAndSoldItems", username)
      .then((res) => {
        setUserItemsOnSale(res.data);
      });
  };

  const getUserBids = () => {
    const username = {
      username: user.username,
    };
    axios
      .post("http://localhost:8080/api/getUserBids", username)
      .then((res) => {
        setUserBids(res.data);
      });
  };

  const deleteItem = (id) => {
    axios
      .delete("http://localhost:8080/api/removeItem", { data: { itemId: id } })
      .then((res) => {
        setReset(true);
      })
      .catch((err) => console.log(err));
  };

  const formatTimestamp = (ts) => {
    /* Split Timestamp into Date and Time */
    const timestamp = ts.split("T");
    const date = timestamp[0];
    const time = timestamp[1];

    /* Year, Month, Day */
    const year = date.split("-")[0];
    const month = date.split("-")[1];
    const day = date.split("-")[2];

    /* Hours, Mins, Secs */
    const hours = time.split(":")[0];
    const mins = time.split(":")[1];
    const secs = time.split(":")[2].split(".")[0];

    /* Return Formatted Date */
    return (
      month + "/" + day + "/" + year + " " + hours + ":" + mins + ":" + secs
    );
  };

  return (
    <div>
      <MyNavbar />
      <Container>
        <Row>
          <Col>
            <h2>Items I Bidded On</h2>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Initial Price</th>
                  <th>Description</th>
                  <th>Time Limit</th>
                  <th>Bid Amount</th>
                </tr>
              </thead>
              <tbody>
                {userBids.map((item) => (
                  <tr key={item.itemId}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.condition}</td>
                    <td>{item.location}</td>
                    <td>{`$${parseFloat(item.bidAmount).toFixed(2)}`}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col>
            <h2>My Items On Sale</h2>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Initial Price</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Condition</th>
                  <th>Location</th>
                  <th>Time Limit</th>
                </tr>
              </thead>
              <tbody>
                {userItemsOnSale.map((item) => (
                  <tr key={item.itemId}>
                    <td>{item.name}</td>
                    <td>{`$${parseFloat(item.initialPrice).toFixed(2)}`}</td>
                    <td>{item.description}</td>
                    <td>{item.category}</td>
                    <td>{item.condition}</td>
                    <td>{item.location}</td>
                    <td>{formatTimestamp(item.timeLimit)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => deleteItem(item.itemId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>

    // <button className="btn btn-primary" onClick={goToSellItemPage}>
    //   Sell Item
    // </button>

    // <button className="btn btn-primary" onClick={goToMyItemsOnSale}>
    //   My Items On Sale
    // </button>

    // <button className="btn btn-primary" onClick={goToMyBids}>
    //   Items I Bidded On
    // </button>

    //   <div className="home-items-table">
    //     <table>
    //       <thead>
    //         <tr>
    //           <th>Item Id</th>
    //           <th>Name</th>
    //           <th>Price</th>
    //           <th>Description</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {items.map((item) => (
    //           <tr
    //             key={item.itemId}
    //             onClick={() => goToBid(item.itemId, item.name)}
    //           >
    //             <td>{item.itemId}</td>
    //             <td>{item.name}</td>
    //             <td>{item.initialPrice}</td>
    //             <td>{item.description}</td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>
  );
}
