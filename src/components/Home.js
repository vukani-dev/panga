import React from 'react'
import { Button, Spinner } from "@blueprintjs/core";

class Home extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)

    }

    handleClick() {
        document.getElementById("directorySelector").click();
    }

    handleFile = (event) => {
        const content = event.target.result;
        console.log(this.state)
        this.setState({ loc: [...this.state.loc, content] });
    }

    handleChange(e) {
        var files = e.target.files;
        var results = []
        var loc = []
        for (var i in files) {
            var reader = new FileReader();
            reader.onloadend = this.handleFile;
            if (files[i] instanceof Blob) {
                results.push(files[i])
                reader.readAsDataURL(files[i]);
            }
        }
        console.log(results)
        this.setState({ files: results, loc: loc })
    }

    testClick() {
        console.log(this.fileInput)
    }

    render() {
        return (
            <div>

                <label>
                    <input hidden id="directorySelector" webkitdirectory="true" type="file"
                        ref={this.fileInput}
                        onChange={(e) => this.handleChange(e)} />
                </label>
                <Button onClick={() => this.handleClick()}>Asjdhasjdasgdujagsdjg</Button>
                {/* <Button onClick={() => this.testClick()}>Test</Button> */}
                <div>
                    <ul>


                        {this.props.files.map((home, i) => {

                            return home.loaded ?
                                <div key={i}>
                                    {home.file.name}
                                    <img style={{ height: '100px', paddingRight: '5px' }} src={home.fileData}></img>
                                </div> :
                                <div key={i}>
                                    {home.file.name}
                                    <Spinner />;
                                </div>

                        }
                        )}
                    </ul>

                </div>
            </div>
        );
    }

}


export default Home