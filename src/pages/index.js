import { useEffect, useState, useRef } from "react";
import { CiTrash } from "react-icons/ci";
import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.scss";

export default function Home() {
  const productNameRef = useRef();
  const productIDToDeleteRef = useRef();
  const productIDToUpdateRef = useRef();
  const productNameToUpdateRef = useRef();
  const [products, setProducts] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [updatedError, setUpdatedError] = useState(false);
  const [created, setCreated] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deletedError, setDeletedError] = useState(false);

  async function addProduct() {
    const productName = productNameRef.current.value.trim();
    if (productName.length < 3) return;
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_name: productName,
      }),
    };
    if (productName.length < 3) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/products`,
      postData
    );
    const response = await res.json();
    console.log(response);
    if (response.response.message !== "success") return;
    const newproduct = response.response.product;
    setProducts([
      ...products,
      {
        product_id: newproduct.product_id,
        product_name: newproduct.product_name,
      },
    ]);
    setCreated(true);
  }

  async function getProducts() {
    const postData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/products`,
      postData
    );
    const response = await res.json();
    setProducts(response.products);
    console.log(response);
  }

  async function deleteProduct(id) {
    if (!id) return;
    const postData = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: id,
      }),
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/products`,
      postData
    );
    const response = await res.json();
    console.log(response.response);
    if (response.response.message === "error") return setDeletedError(true);
    const idToRemove = parseFloat(response.response.product_id);
    setProducts(products.filter((a) => a.product_id !== idToRemove));
    setDeleted(true);
  }

  async function updateProduct() {
    const productIDToUpdate = productIDToUpdateRef.current.value.trim();
    const productNameToUpdate = productNameToUpdateRef.current.value.trim();
    if (!productIDToUpdate.length) return;
    const postData = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productIDToUpdate,
        product_name: productNameToUpdate,
      }),
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/products`,
      postData
    );
    const response = await res.json();
    if (response.response.message === "error") return setUpdatedError(true);
    // if (response.response.message !== "success") return;
    const productIdUpdated = parseFloat(response.response.product.product_id);
    const productUpdatedName = response.response.product.product_name;
    //updating state
    const productsStateAfterUpdate = products.map((product) => {
      if (product.product_id === productIdUpdated) {
        const productUpdated = {
          ...product,
          product_name: productUpdatedName,
        };
        return productUpdated;
      } else {
        return {
          ...product,
        };
      }
    });
    setUpdated(true);
    setProducts(productsStateAfterUpdate);
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      {" "}
      <Head>
        <title>CRUD With Next.Js & MySQL Demo</title>
      </Head>
      <div className={styles.container}>
        <section className={styles.main}>
          <h1>CRUD With Next.Js & MySQL Demo</h1>
          {/* <p>
            Create, Read, Update, Delete database data in React, Node, Next.js
            and MySQL by Omar Elbaga{" "}
            <a
              href="https://github.com/oelbaga/nextjs-mysql"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </p> */}
          <div className={styles.heading}>
            <a href="/api/products" target="_blank" rel="noreferrer">
              Database API data
            </a>
          </div>
        </section>
        <section>
          <div className={styles.read}>
            <h2>Read</h2>
            <div className={styles.products}>
              {products.map((item, index) => {
                return (
                  <div key={item.product_id} className={styles.product}>
                    <span>product_id</span>: {item.product_id} <br />{" "}
                    <span>product_name</span>: {item.product_name}{" "}
                    <CiTrash
                      className={styles.icons}
                      onClick={() => deleteProduct(item.product_id)}
                    />
                  </div>
                );
              })}
              {!products.length ? <>No products found</> : null}
            </div>
          </div>
        </section>
        <section>
          <div className={styles.create}>
            <h2>Create</h2>
            <div className={styles.input}>
              <div className={styles.label}>Product Name</div>
              <input type="text" ref={productNameRef} />
            </div>
            {created ? <div className={styles.success}>Success!</div> : null}
            <div className={styles.buttonarea}>
              <input
                className={styles.button}
                value="Save"
                type="button"
                onClick={addProduct}
              />
            </div>
          </div>
        </section>
        <section>
          <div className={styles.update}>
            <h2>Update</h2>
            <div className={styles.input}>
              <div className={styles.label}>Product Id</div>
              <input type="text" ref={productIDToUpdateRef} />
            </div>
            <div className={styles.input}>
              <div className={styles.label}>Product Name</div>
              <input type="text" ref={productNameToUpdateRef} />
            </div>
            {updated ? <div className={styles.success}>Success!</div> : null}
            {updatedError ? <div className={styles.error}>Error!</div> : null}
            <div className={styles.buttonarea}>
              <input
                className={styles.button}
                value="Update"
                type="button"
                onClick={updateProduct}
              />
            </div>
          </div>
        </section>
        <section>
          <div className={styles.delete}>
            <h2>Delete</h2>
            <div className={styles.input}>
              <div className={styles.label}>Product Id</div>
              <input type="text" ref={productIDToDeleteRef} />
            </div>
            {deleted ? <div className={styles.success}>Success!</div> : null}
            {deletedError ? <div className={styles.error}>Error!</div> : null}
            <div className={styles.buttonarea}>
              <input
                className={`${styles.button} ${styles.warning}`}
                value="Delete"
                type="button"
                onClick={() =>
                  deleteProduct(productIDToDeleteRef.current.value)
                }
              />
            </div>
          </div>
        </section>
        <footer>
          <p>
            Create, Read, Update, Delete database data in React, Node and
            Next.JS by Omar Elbaga{" "}
            <a
              href="https://github.com/oelbaga/nextjs-mysql"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}
